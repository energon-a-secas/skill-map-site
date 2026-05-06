import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

// ===== Icon Category Management =====

export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    username: v.string(), // Admin only
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user || user.role !== "admin") {
      return { ok: false, error: "Admin only" };
    }

    const now = Date.now();
    const categoryId = await ctx.db.insert("iconCategories", {
      name: args.name,
      description: args.description,
      iconCount: 0,
      createdAt: now,
    });

    return { ok: true, categoryId };
  },
});

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("iconCategories").collect();

    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const icons = await ctx.db
          .query("icons")
          .filter((q) => q.eq(q.field("categoryId"), cat._id))
          .collect();

        return {
          id: cat._id,
          name: cat.name,
          description: cat.description,
          iconCount: icons.length,
          createdAt: cat.createdAt,
        };
      })
    );

    return { ok: true, categories: enriched };
  },
});

export const deleteCategory = mutation({
  args: {
    categoryId: v.id("iconCategories"),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user || user.role !== "admin") {
      return { ok: false, error: "Admin only" };
    }

    // Check if category has icons
    const icons = await ctx.db
      .query("icons")
      .filter((q) => q.eq(q.field("categoryId"), args.categoryId))
      .collect();

    if (icons.length > 0) {
      return { ok: false, error: `Category has ${icons.length} icons. Delete them first.` };
    }

    await ctx.db.delete(args.categoryId);
    return { ok: true };
  },
});

// ===== Icon Upload Management =====

export const getUploadUrl = mutation({
  args: {
    categoryId: v.id("iconCategories"),
    filename: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user || user.role !== "admin") {
      return { ok: false, error: "Admin only" };
    }

    // Only allow PNG and SVG
    const ext = args.filename.split(".").pop()?.toLowerCase();
    if (ext !== "png" && ext !== "svg") {
      return { ok: false, error: "Only PNG and SVG files allowed" };
    }

    const uploadUrl = await ctx.storage.getUploadUrl();
    return { ok: true, uploadUrl, storageId: uploadUrl.split("/").pop() };
  },
});

export const saveIcon = mutation({
  args: {
    categoryId: v.id("iconCategories"),
    name: v.string(),
    filename: v.string(),
    storageId: v.id("_storage"),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user || user.role !== "admin") {
      return { ok: false, error: "Admin only" };
    }

    const now = Date.now();
    const iconId = await ctx.db.insert("icons", {
      categoryId: args.categoryId,
      name: args.name,
      filename: args.filename,
      storageId: args.storageId,
      uploadedBy: user._id,
      createdAt: now,
    });

    return { ok: true, iconId };
  },
});

export const listIcons = query({
  args: {
    categoryId: v.optional(v.id("iconCategories")),
  },
  handler: async (ctx, args) => {
    let icons;

    if (args.categoryId) {
      icons = await ctx.db
        .query("icons")
        .filter((q) => q.eq(q.field("categoryId"), args.categoryId))
        .collect();
    } else {
      icons = await ctx.db.query("icons").collect();
    }

    const enriched = await Promise.all(
      icons.map(async (icon) => {
        const uploader = await ctx.db.get(icon.uploadedBy);
        const category = await ctx.db.get(icon.categoryId);

        return {
          id: icon._id,
          name: icon.name,
          filename: icon.filename,
          storageId: icon.storageId,
          url: await ctx.storage.getUrl(icon.storageId),
          uploadedBy: uploader?.username || "Unknown",
          category: category?.name || "Unknown",
          createdAt: icon.createdAt,
        };
      })
    );

    return { ok: true, icons: enriched };
  },
});

export const deleteIcon = mutation({
  args: {
    iconId: v.id("icons"),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user || user.role !== "admin") {
      return { ok: false, error: "Admin only" };
    }

    const icon = await ctx.db.get(args.iconId);
    if (!icon) {
      return { ok: false, error: "Icon not found" };
    }

    // Delete from storage
    await ctx.storage.delete(icon.storageId);

    // Delete from database
    await ctx.db.delete(args.iconId);

    return { ok: true };
  },
});

// ===== Preset Icon Categories =====

export const seedPresetCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const categories = [
      { name: "Meditation", description: "Mindfulness and meditation practices" },
      { name: "Fitness", description: "Physical exercise and workouts" },
      { name: "Creative", description: "Art, music, writing, and creative pursuits" },
      { name: "Tech", description: "Programming, tech skills, and software" },
      { name: "Learning", description: "Education, study, and knowledge" },
      { name: "Languages", description: "Language learning and practice" },
      { name: "Music", description: "Instruments, theory, and performance" },
      { name: "Culinary", description: "Cooking, baking, and food preparation" },
      { name: "Social", description: "Communication, relationships, social skills" },
      { name: "Hobbies", description: "Games, crafts, and leisure activities" },
    ];

    const now = Date.now();
    let count = 0;

    for (const cat of categories) {
      const existing = await ctx.db
        .query("iconCategories")
        .filter((q) => q.eq(q.field("name"), cat.name))
        .first();

      if (!existing) {
        await ctx.db.insert("iconCategories", {
          name: cat.name,
          description: cat.description,
          iconCount: 0,
          createdAt: now,
        });
        count++;
      }
    }

    return { ok: true, count };
  },
});

// ===== User Icon Picker =====

export const getIconsForPicker = query({
  args: {
    categoryId: v.optional(v.id("iconCategories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let icons;
    const limit = args.limit || 48;

    if (args.categoryId) {
      icons = await ctx.db
        .query("icons")
        .filter((q) => q.eq(q.field("categoryId"), args.categoryId))
        .take(limit);
    } else {
      icons = await ctx.db.query("icons").take(limit);
    }

    const enriched = await Promise.all(
      icons.map(async (icon) => {
        const category = await ctx.db.get(icon.categoryId);
        return {
          id: icon._id,
          name: icon.name,
          url: await ctx.storage.getUrl(icon.storageId),
          category: category?.name || "Unknown",
        };
      })
    );

    return { ok: true, icons: enriched };
  },
});

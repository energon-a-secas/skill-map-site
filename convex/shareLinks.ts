import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { username: v.string(), roadmapId: v.id("roadmaps") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const roadmap = await ctx.db.get(args.roadmapId);
    if (!roadmap || roadmap.userId !== user._id) {
      return { ok: false, error: "Roadmap not found or access denied" };
    }

    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = Date.now();

    const shareLinkId = await ctx.db.insert("shareLinks", {
      token,
      roadmapId: args.roadmapId,
      createdBy: user._id,
      isActive: true,
      createdAt: now,
      viewCount: 0,
    });

    return { ok: true, token, shareLinkId };
  },
});

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!shareLink || !shareLink.isActive) {
      return { ok: false, error: "Invalid or expired link" };
    }

    // Get the roadmap
    const roadmap = await ctx.db.get(shareLink.roadmapId);
    if (!roadmap) {
      return { ok: false, error: "Roadmap not found" };
    }

    return {
      ok: true,
      roadmap: {
        id: roadmap._id,
        title: roadmap.title,
        description: roadmap.description,
        data: roadmap.data,
        isPublic: roadmap.isPublic,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
      }
    };
  },
});

export const disable = mutation({
  args: { username: v.string(), token: v.string(), disable: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!shareLink || shareLink.createdBy !== user._id) {
      return { ok: false, error: "Share link not found or access denied" };
    }

    const shouldDisable = args.disable !== undefined ? args.disable : false;

    await ctx.db.patch(shareLink._id, {
      isActive: !shouldDisable,
    });

    return { ok: true };
  },
});

// Get share link for a specific roadmap
export const getByRoadmapId = query({
  args: { username: v.string(), roadmapId: v.id("roadmaps") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const roadmap = await ctx.db.get(args.roadmapId);
    if (!roadmap || roadmap.userId !== user._id) {
      return { ok: false, error: "Roadmap not found or access denied" };
    }

    const shareLink = await ctx.db
      .query("shareLinks")
      .filter((q) => q.eq(q.field("roadmapId"), args.roadmapId))
      .first();

    if (!shareLink) {
      return { ok: true, link: null, roadmap: { title: roadmap.title } };
    }

    return {
      ok: true,
      link: {
        token: shareLink.token,
        isActive: shareLink.isActive,
        views: shareLink.viewCount,
        createdAt: shareLink.createdAt,
      },
      roadmap: {
        title: roadmap.title,
      }
    };
  },
});

// Record a view (for anonymous visitors)
export const recordView = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!shareLink || !shareLink.isActive) {
      return { ok: false, error: "Invalid link" };
    }

    await ctx.db.patch(shareLink._id, {
      viewCount: shareLink.viewCount + 1,
    });

    return { ok: true };
  },
});
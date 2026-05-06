import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const roadmaps = await ctx.db
      .query("roadmaps")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      ok: true,
      roadmaps: roadmaps.map(r => ({
        id: r._id,
        title: r.title,
        description: r.description,
        isPublic: r.isPublic,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }))
    };
  },
});

export const get = query({
  args: { roadmapId: v.id("roadmaps") },
  handler: async (ctx, args) => {
    const roadmap = await ctx.db.get(args.roadmapId);
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

export const save = mutation({
  args: {
    username: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    data: v.string(),
    roadmapId: v.optional(v.id("roadmaps")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const now = Date.now();

    if (args.roadmapId) {
      // Update existing roadmap
      const existing = await ctx.db.get(args.roadmapId);
      if (!existing || existing.userId !== user._id) {
        return { ok: false, error: "Roadmap not found or access denied" };
      }

      await ctx.db.patch(args.roadmapId, {
        title: args.title,
        description: args.description,
        data: args.data,
        updatedAt: now,
      });

      return { ok: true, roadmapId: args.roadmapId };
    } else {
      // Create new roadmap
      const roadmapId = await ctx.db.insert("roadmaps", {
        userId: user._id,
        title: args.title,
        description: args.description,
        data: args.data,
        isPublic: false,
        createdAt: now,
        updatedAt: now,
      });

      return { ok: true, roadmapId };
    }
  },
});

export const deleteRoadmap = mutation({
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

    // Also delete any share links for this roadmap
    const shareLinks = await ctx.db
      .query("shareLinks")
      .filter((q) => q.eq(q.field("roadmapId"), args.roadmapId))
      .collect();

    for (const link of shareLinks) {
      await ctx.db.delete(link._id);
    }

    await ctx.db.delete(args.roadmapId);
    return { ok: true };
  },
});
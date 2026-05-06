import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    role: v.optional(v.string()),
  }).index("by_username", ["username"]),

  roadmaps: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    data: v.string(), // JSON stringified roadmap data
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  shareLinks: defineTable({
    token: v.string(),
    roadmapId: v.id("roadmaps"),
    createdBy: v.id("users"),
    isActive: v.boolean(),
    createdAt: v.number(),
    viewCount: v.number(),
  }).index("by_token", ["token"]),

  // Gamification tables
  skills: defineTable({
    userId: v.id("users"),
    name: v.string(),
    icon: v.string(),
    category: v.optional(v.string()),
    xp: v.number(),
    level: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  streaks: defineTable({
    userId: v.id("users"),
    skillId: v.id("skills"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastSessionDate: v.optional(v.number()),
    createdAt: v.number(),
  }),

  skillSessions: defineTable({
    userId: v.id("users"),
    skillId: v.id("skills"),
    duration: v.number(), // in minutes
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  badges: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    tier: v.string(), // bronze, silver, gold, platinum
    requirementType: v.string(), // skill_level, skill_count, session_count, streak_days, total_xp
    requirementValue: v.number(),
    createdAt: v.number(),
  }),

  userBadges: defineTable({
    userId: v.id("users"),
    badgeId: v.id("badges"),
    earnedAt: v.number(),
  }),

  // Icons for skills
  iconCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    iconCount: v.number(),
    createdAt: v.number(),
  }),

  icons: defineTable({
    categoryId: v.id("iconCategories"),
    name: v.string(),
    filename: v.string(),
    storageId: v.id("_storage"),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
  }),
});

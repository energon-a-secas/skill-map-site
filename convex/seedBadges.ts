// Badge seeding utility - run once to populate badges

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define all badges
const BADGE_DEFINITIONS = [
  // Streak badges
  { name: "First Steps", description: "Maintain a 3-day streak", icon: "👶", tier: "bronze", requirementType: "streak_days", requirementValue: 3 },
  { name: "Week Warrior", description: "Maintain a 7-day streak", icon: "⚔️", tier: "silver", requirementType: "streak_days", requirementValue: 7 },
  { name: "Fortnight Fighter", description: "Maintain a 14-day streak", icon: "🏆", tier: "gold", requirementType: "streak_days", requirementValue: 14 },
  { name: "Monthly Master", description: "Maintain a 30-day streak", icon: "👑", tier: "gold", requirementType: "streak_days", requirementValue: 30 },
  { name: "Streak Legend", description: "Maintain a 50-day streak", icon: "🔥", tier: "platinum", requirementType: "streak_days", requirementValue: 50 },
  { name: "Century Champion", description: "Maintain a 100-day streak", icon: "💎", tier: "platinum", requirementType: "streak_days", requirementValue: 100 },

  // Level badges
  { name: "Level 5 Learner", description: "Reach level 5 in any skill", icon: "🌱", tier: "bronze", requirementType: "skill_level", requirementValue: 5 },
  { name: "Level 10 Expert", description: "Reach level 10 in any skill", icon: "🌿", tier: "bronze", requirementType: "skill_level", requirementValue: 10 },
  { name: "Level 25 Master", description: "Reach level 25 in any skill", icon: "🌳", tier: "silver", requirementType: "skill_level", requirementValue: 25 },
  { name: "Level 50 Grandmaster", description: "Reach level 50 in any skill", icon: "⭐", tier: "gold", requirementType: "skill_level", requirementValue: 50 },
  { name: "Level 75 Demigod", description: "Reach level 75 in any skill", icon: "🌟", tier: "platinum", requirementType: "skill_level", requirementValue: 75 },
  { name: "Level 100 Deity", description: "Reach level 100 in any skill", icon: "✨", tier: "platinum", requirementType: "skill_level", requirementValue: 100 },

  // Session count badges
  { name: "First Practice", description: "Complete your first session", icon: "🎯", tier: "bronze", requirementType: "session_count", requirementValue: 1 },
  { name: "Deca Devotee", description: "Complete 10 sessions", icon: "🔟", tier: "bronze", requirementType: "session_count", requirementValue: 10 },
  { name: "Hectic Hundred", description: "Complete 100 sessions", icon: "💯", tier: "silver", requirementType: "session_count", requirementValue: 100 },
  { name: "Session Savant", description: "Complete 500 sessions", icon: "🧠", tier: "gold", requirementType: "session_count", requirementValue: 500 },
  { name: "Practice Prophet", description: "Complete 1000 sessions", icon: "🔮", tier: "platinum", requirementType: "session_count", requirementValue: 1000 },

  // Skill count badges
  { name: "Skill Sprout", description: "Create 3 skills", icon: "🌱", tier: "bronze", requirementType: "skill_count", requirementValue: 3 },
  { name: "Skill Sapling", description: "Create 5 skills", icon: "🌿", tier: "bronze", requirementType: "skill_count", requirementValue: 5 },
  { name: "Skill Tree", description: "Create 10 skills", icon: "🌳", tier: "silver", requirementType: "skill_count", requirementValue: 10 },
  { name: "Skill Forest", description: "Create 20 skills", icon: "🌲", tier: "gold", requirementType: "skill_count", requirementValue: 20 },
  { name: "Skill Universe", description: "Create 50 skills", icon: "🌌", tier: "platinum", requirementType: "skill_count", requirementValue: 50 },

  // Total XP badges
  { name: "XP Explorer", description: "Accumulate 1000 total XP", icon: "🔍", tier: "bronze", requirementType: "total_xp", requirementValue: 1000 },
  { name: "XP Expert", description: "Accumulate 5000 total XP", icon: "📊", tier: "silver", requirementType: "total_xp", requirementValue: 5000 },
  { name: "XP Elite", description: "Accumulate 10000 total XP", icon: "💎", tier: "gold", requirementType: "total_xp", requirementValue: 10000 },
  { name: "XP Emperor", description: "Accumulate 25000 total XP", icon: "👑", tier: "platinum", requirementType: "total_xp", requirementValue: 25000 },

  // Special badges
  { name: "Early Bird", description: "Practice before 7 AM", icon: "🐦", tier: "bronze", requirementType: "custom", requirementValue: 0 },
  { name: "Night Owl", description: "Practice after 10 PM", icon: "🦉", tier: "bronze", requirementType: "custom", requirementValue: 0 },
  { name: "Weekend Warrior", description: "Practice on weekends", icon: "⚔️", tier: "silver", requirementType: "custom", requirementValue: 0 },
  { name: "Consistent Cat", description: "Practice same time daily for 7 days", icon: "🐱", tier: "gold", requirementType: "custom", requirementValue: 0 },
];

export const seedBadges = mutation({
  args: {},
  handler: async (ctx) => {
    const existingBadges = await ctx.db.query("badges").collect();
    if (existingBadges.length > 0) {
      return { ok: false, error: "Badges already seeded", count: existingBadges.length };
    }

    const now = Date.now();
    let count = 0;

    for (const badgeDef of BADGE_DEFINITIONS) {
      await ctx.db.insert("badges", {
        ...badgeDef,
        createdAt: now,
      });
      count++;
    }

    return { ok: true, count };
  },
});

export const addBadge = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    tier: v.string(),
    requirementType: v.string(),
    requirementValue: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const badgeId = await ctx.db.insert("badges", {
      name: args.name,
      description: args.description,
      icon: args.icon,
      tier: args.tier,
      requirementType: args.requirementType,
      requirementValue: args.requirementValue,
      createdAt: now,
    });

    return { ok: true, badgeId };
  },
});

export const listBadges = query({
  args: {},
  handler: async (ctx) => {
    const badges = await ctx.db.query("badges").collect();
    return {
      ok: true,
      badges: badges.map(b => ({
        id: b._id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        tier: b.tier,
        requirementType: b.requirementType,
        requirementValue: b.requirementValue,
      }))
    };
  },
});

export const getBadgeProgress = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const skills = await ctx.db
      .query("skills")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    const sessions = await ctx.db
      .query("skillSessions")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    const streaks = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    const earnedBadges = await ctx.db
      .query("userBadges")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badgeId));
    const allBadges = await ctx.db.query("badges").collect();

    const progress = allBadges.map((badge) => {
      const isEarned = earnedBadgeIds.has(badge._id);
      let progress = 0;
      let current = 0;
      let target = badge.requirementValue;

      if (!isEarned) {
        switch (badge.requirementType) {
          case "skill_level":
            current = Math.max(...skills.map((s) => s.level), 0);
            progress = Math.min(100, (current / target) * 100);
            break;
          case "skill_count":
            current = skills.length;
            progress = Math.min(100, (current / target) * 100);
            break;
          case "session_count":
            current = sessions.length;
            progress = Math.min(100, (current / target) * 100);
            break;
          case "streak_days":
            current = Math.max(...streaks.map((s) => s.longestStreak), 0);
            progress = Math.min(100, (current / target) * 100);
            break;
          case "total_xp":
            current = skills.reduce((sum, s) => sum + s.xp, 0);
            progress = Math.min(100, (current / target) * 100);
            break;
        }
      } else {
        progress = 100;
        current = target;
      }

      return {
        id: badge._id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        tier: badge.tier,
        requirementType: badge.requirementType,
        requirementValue: target,
        isEarned,
        progress: Math.floor(progress),
        current,
        target,
      };
    });

    return { ok: true, badges: progress };
  },
});

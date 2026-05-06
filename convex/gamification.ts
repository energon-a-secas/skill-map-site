import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============== Skills Table ==============

export const addSkill = mutation({
  args: {
    username: v.string(),
    name: v.string(),
    icon: v.optional(v.string()),
    category: v.optional(v.string()),
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
    const skillId = await ctx.db.insert("skills", {
      userId: user._id,
      name: args.name,
      icon: args.icon || "⭐",
      category: args.category,
      xp: 0,
      level: 1,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize streak record
    await ctx.db.insert("streaks", {
      userId: user._id,
      skillId,
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      createdAt: now,
    });

    return { ok: true, skillId };
  },
});

export const getSkill = query({
  args: { skillId: v.id("skills") },
  handler: async (ctx, args) => {
    const skill = await ctx.db.get(args.skillId);
    if (!skill) {
      return { ok: false, error: "Skill not found" };
    }

    const streak = await ctx.db
      .query("streaks")
      .filter((q) => q.and(q.eq(q.field("skillId"), args.skillId)))
      .first();

    return {
      ok: true,
      skill: {
        id: skill._id,
        name: skill.name,
        icon: skill.icon,
        category: skill.category,
        xp: skill.xp,
        level: skill.level,
        streak: streak || null,
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt,
      }
    };
  },
});

export const listSkills = query({
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

    const skillsWithStreaks = await Promise.all(
      skills.map(async (skill) => {
        const streak = await ctx.db
          .query("streaks")
          .filter((q) => q.eq(q.field("skillId"), skill._id))
          .first();

        return {
          id: skill._id,
          name: skill.name,
          icon: skill.icon,
          category: skill.category,
          xp: skill.xp,
          level: skill.level,
          streak: streak || null,
          createdAt: skill.createdAt,
          updatedAt: skill.updatedAt,
        };
      })
    );

    return { ok: true, skills: skillsWithStreaks };
  },
});

export const updateSkill = mutation({
  args: {
    skillId: v.id("skills"),
    username: v.string(),
    xp: v.number(),
    level: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const skill = await ctx.db.get(args.skillId);
    if (!skill || skill.userId !== user._id) {
      return { ok: false, error: "Skill not found or access denied" };
    }

    await ctx.db.patch(args.skillId, {
      xp: args.xp,
      level: args.level,
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});

// ============== Session Logging ==============

export const logSession = mutation({
  args: {
    username: v.string(),
    skillId: v.id("skills"),
    duration: v.number(), // in minutes
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const skill = await ctx.db.get(args.skillId);
    if (!skill || skill.userId !== user._id) {
      return { ok: false, error: "Skill not found or access denied" };
    }

    const now = Date.now();
    const today = new Date(now).toDateString();

    // Log the session
    await ctx.db.insert("skillSessions", {
      userId: user._id,
      skillId: args.skillId,
      duration: args.duration,
      notes: args.notes,
      createdAt: now,
    });

    // Update streak
    const streak = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("skillId"), args.skillId))
      .first();

    if (streak) {
      const lastSession = streak.lastSessionDate ? new Date(streak.lastSessionDate).toDateString() : null;

      let newStreak = streak.currentStreak;
      let newLongest = streak.longestStreak;

      if (lastSession !== today) {
        // Check if it's consecutive (yesterday)
        const yesterday = new Date(now - 86400000).toDateString();
        if (lastSession === yesterday) {
          newStreak += 1;
        } else if (lastSession !== today) {
          // Broken streak, reset to 1
          newStreak = 1;
        }

        if (newStreak > newLongest) {
          newLongest = newStreak;
        }
      }

      await ctx.db.patch(streak._id, {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastSessionDate: now,
      });

      return { ok: true, streak: newStreak };
    }

    return { ok: true, streak: 1 };
  },
});

// ============== Badge System ==============

export const getUserBadges = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();

    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const userBadges = await ctx.db
      .query("userBadges")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    const badgeIds = userBadges.map((ub) => ub.badgeId);
    const badges = await Promise.all(
      badgeIds.map((id) => ctx.db.get(id))
    );

    return {
      ok: true,
      badges: badges.map((badge, i) => ({
        id: badge._id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        tier: badge.tier,
        earnedAt: userBadges[i].earnedAt,
      }))
    };
  },
});

export const checkAndAwardBadges = mutation({
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
    const newAwards = [] as any[];

    // Check for badges
    const allBadges = await ctx.db.query("badges").collect();

    for (const badge of allBadges) {
      if (earnedBadgeIds.has(badge._id)) continue;

      let shouldAward = false;

      switch (badge.requirementType) {
        case "skill_level":
          shouldAward = skills.some(s => s.level >= badge.requirementValue);
          break;
        case "skill_count":
          shouldAward = skills.length >= badge.requirementValue;
          break;
        case "session_count":
          shouldAward = sessions.length >= badge.requirementValue;
          break;
        case "streak_days":
          shouldAward = streaks.some(s => s.longestStreak >= badge.requirementValue);
          break;
        case "total_xp":
          const totalXP = skills.reduce((sum, s) => sum + s.xp, 0);
          shouldAward = totalXP >= badge.requirementValue;
          break;
      }

      if (shouldAward) {
        await ctx.db.insert("userBadges", {
          userId: user._id,
          badgeId: badge._id,
          earnedAt: Date.now(),
        });
        newAwards.push(badge);
      }
    }

    return {
      ok: true,
      newBadges: newAwards.map(b => ({
        id: b._id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        tier: b.tier,
      }))
    };
  },
});
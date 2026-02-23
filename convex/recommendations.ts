import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { GENRES } from "./genres";
import { getUserByClerkId } from "./users";

const genreValidator = v.union(
    ...GENRES.map((g) => v.literal(g))
);

// PUBLIC QUERY: Anyone can fetch recommendations
export const get = query({
    args: {
        genre: v.optional(genreValidator),
    },
    handler: async (ctx, args) => {
        const genre = args.genre;
        if (genre) {
            return await ctx.db
                .query("recommendations")
                .withIndex("by_genre", (q) => q.eq("genre", genre))
                .order("desc")
                .collect();
        }

        return await ctx.db
            .query("recommendations")
            .order("desc")
            .collect();
    },
});

// PROTECTED MUTATION: Add a recommendation
export const add = mutation({
    args: {
        clerkId: v.string(),
        authorName: v.string(),
        title: v.string(),
        genre: genreValidator,
        link: v.string(),
        blurb: v.string(),
    },
    handler: async (ctx, args) => {

        await ctx.db.insert("recommendations", {
            title: args.title,
            genre: args.genre,
            link: args.link,
            blurb: args.blurb,
            authorClerkId: args.clerkId,
            authorName: args.authorName,
            isStaffPick: false,
        });
    },
});

// PROTECTED MUTATION: Delete (Admin can delete any, user can delete only theirs).
export const remove = mutation({
    args: {
        clerkId: v.string(),
        id: v.id("recommendations"),
    },
    handler: async (ctx, args) => {
        const rec = await ctx.db.get(args.id);
        if (!rec) throw new Error("Recommendation not found");

        const user = await getUserByClerkId(ctx, args.clerkId);

        // Permission check: Admins can delete any recommendation, users can only delete their own.
        const isAdmin = user?.role === "admin";
        const isOwner = rec.authorClerkId === args.clerkId;

        if (!isAdmin && !isOwner) {
            throw new Error("Forbidden: You can only delete your own recommendations");
        }

        await ctx.db.delete(args.id);
    },
});

// PROTECTED MUTATION: Toggle Staff Pick (Admin ONLY)
export const toggleStaffPick = mutation({
    args: {
        clerkId: v.string(),
        id: v.id("recommendations"),
    },
    handler: async (ctx, args) => {
        const user = await getUserByClerkId(ctx, args.clerkId);

        // Permission check: Only admins can toggle Staff Pick
        if (user?.role !== "admin") {
            throw new Error("Forbidden: Only admins can mark as Staff Pick");
        }

        const rec = await ctx.db.get(args.id);
        if (!rec) throw new Error("Recommendation not found");

        await ctx.db.patch(args.id, {
            isStaffPick: !rec.isStaffPick,
        });
    },
});
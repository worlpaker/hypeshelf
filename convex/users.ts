import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// getUserByClerkId is a helper function to fetch a user by their Clerk ID.
// It is for internal use only.
export async function getUserByClerkId(
    ctx: QueryCtx | MutationCtx,
    clerkId: string
) {
    return await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();
}

// Publicly readable so the frontend knows what role the current user is.
export const getUserRole = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await getUserByClerkId(ctx, args.clerkId);
        return user?.role ?? "user";
    },
});

// Protected mutation to sync users on login.
export const syncUser = mutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const existing = await getUserByClerkId(ctx, args.clerkId);

        if (!existing) {
            // IMPORTANT(dev):
            // The first person to ever log in gets to be the admin.
            const firstUser = await ctx.db.query("users").take(1);
            const role = firstUser.length === 0 ? "admin" : "user";

            await ctx.db.insert("users", {
                clerkId: args.clerkId,
                role,
            });
        }
    },
});
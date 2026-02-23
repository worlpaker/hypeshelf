import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users table to manage roles (Admin vs User)
    users: defineTable({
        clerkId: v.string(),
        role: v.union(v.literal("admin"), v.literal("user")),
    }).index("by_clerk_id", ["clerkId"]),

    // HypeShelf recommendations
    recommendations: defineTable({
        title: v.string(),
        genre: v.string(),
        link: v.string(),
        blurb: v.string(),
        authorClerkId: v.string(), // Securely tied to the Clerk user.
        authorName: v.string(),    // Stored to easily display who added it.
        isStaffPick: v.boolean(),
    })
        .index("by_author", ["authorClerkId"])
        .index("by_genre", ["genre"]),
});
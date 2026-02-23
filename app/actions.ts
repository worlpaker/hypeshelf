"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Genre } from "@/convex/genres";

// Initialize a standard Convex HTTP client for the server.
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// 1. Sync the user to the database (called when they load the app).
export async function syncCurrentUser() {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) return;

    await convex.mutation(api.users.syncUser, {
        clerkId: userId,
    });
}


// 2. Add a recommendation (only for authenticated users, but any user can add).
export async function addRecommendationAction(formData: FormData) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const genre = formData.get("genre") as Genre;
    const link = formData.get("link") as string;
    const blurb = formData.get("blurb") as string;

    // Format the author's name nicely. 
    const authorName = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : "Anonymous HypeBeast";

    await convex.mutation(api.recommendations.add, {
        clerkId: user.id,
        authorName,
        title,
        genre,
        link,
        blurb,
    });
}

// 3. Delete a recommendation (Admin can delete any, User can delete only theirs).
export async function deleteRecommendationAction(id: string) {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    await convex.mutation(api.recommendations.remove, {
        clerkId: userId,
        id: id as Id<"recommendations">,
    });
}

// 4. Toggle Staff Pick (Admins only)
export async function toggleStaffPickAction(id: string) {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    await convex.mutation(api.recommendations.toggleStaffPick, {
        clerkId: userId,
        id: id as Id<"recommendations">,
    });
}
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { syncCurrentUser } from "@/app/actions";
import { type Genre } from "@/convex/genres";

/**
 * Combines user state, recommendation fetching, role lookup, and
 * automatic syncing into a single hook for use in the main page.
 */
export function useRecommendationsData(selectedGenre: Genre | "All") {
    const { user, isSignedIn } = useUser();

    const recommendations = useQuery(
        api.recommendations.get,
        selectedGenre === "All" ? {} : { genre: selectedGenre }
    );

    const role = useQuery(
        api.users.getUserRole,
        user?.id ? { clerkId: user.id } : "skip"
    );
    const isAdmin = role === "admin";

    useEffect(() => {
        if (isSignedIn) {
            syncCurrentUser();
        }
    }, [isSignedIn]);

    return {
        user,
        isSignedIn,
        isAdmin,
        recommendations,
    };
}

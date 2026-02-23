import { Spinner } from "@/components/ui/spinner";
import { RecommendationCard, Recommendation } from "./RecommendationCard";
import { type Genre } from "@/convex/genres";

interface RecommendationsSectionProps {
    recommendations: Recommendation[] | undefined;
    selectedGenre: Genre | "All";
    currentUserId?: string;
    isAdmin: boolean;
    onDelete: (id: string) => void;
    onToggleStaffPick: (id: string) => void;
}

export function RecommendationsSection({
    recommendations,
    selectedGenre,
    currentUserId,
    isAdmin,
    onDelete,
    onToggleStaffPick,
}: RecommendationsSectionProps) {
    if (recommendations === undefined) {
        return (
            <div className="flex justify-center items-center text-muted-foreground py-24">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12 border rounded-xl border-dashed">
                No recommendations found for {selectedGenre}. Be the first!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
                <RecommendationCard
                    key={rec._id}
                    rec={rec}
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    onDelete={onDelete}
                    onToggleStaffPick={onToggleStaffPick}
                />
            ))}
        </div>
    );
}

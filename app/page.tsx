"use client";

import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";

// actions
import { addRecommendationAction, deleteRecommendationAction, toggleStaffPickAction } from "./actions";

// custom hook & components
import { useRecommendationsData } from "@/hooks/useRecommendationsData";
import { FilterBadges } from "@/components/FilterBadges";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { AddRecommendationDialog } from "@/components/AddRecommendationDialog";
import { type Genre } from "@/convex/genres";

// Shadcn UI Components
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Genre state for frontend-only filtering. "All" is added in the component itself for better UX.
  const [selectedGenre, setSelectedGenre] = useState<Genre | "All">("All");
  const { user, isSignedIn, isAdmin, recommendations } = useRecommendationsData(selectedGenre);

  async function handleAdd(formData: FormData) {
    await addRecommendationAction(formData);
    setIsDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          HypeShelf
        </h1>
        <p className="text-lg text-muted-foreground">
          Collect and share the stuff you’re hyped about.
        </p>
      </section>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <FilterBadges
          selected={selectedGenre}
          onSelect={setSelectedGenre}
        />

        {isSignedIn ? (
          <AddRecommendationDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleAdd}
          />
        ) : (
          <SignInButton mode="modal">
            <Button size="lg">Sign in to add yours</Button>
          </SignInButton>
        )}
      </div>

      <RecommendationsSection
        recommendations={recommendations}
        selectedGenre={selectedGenre}
        currentUserId={user?.id}
        isAdmin={isAdmin}
        onDelete={deleteRecommendationAction}
        onToggleStaffPick={toggleStaffPickAction}
      />
    </div>
  );
}
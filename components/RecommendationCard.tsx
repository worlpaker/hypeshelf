import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2 } from "lucide-react";

export interface Recommendation {
    _id: string;
    title: string;
    genre: string;
    link: string;
    blurb: string;
    authorClerkId: string;
    authorName: string;
    isStaffPick: boolean;
}

interface RecommendationCardProps {
    rec: Recommendation;
    currentUserId?: string;
    isAdmin: boolean;
    onDelete: (id: string) => void;
    onToggleStaffPick: (id: string) => void;
}

export function RecommendationCard({
    rec,
    currentUserId,
    isAdmin,
    onDelete,
    onToggleStaffPick,
}: RecommendationCardProps) {
    const isOwner = currentUserId === rec.authorClerkId;
    const canDelete = isAdmin || isOwner;

    return (
        <Card className="flex flex-col relative overflow-hidden group min-w-0 w-full">
            {rec.isStaffPick && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    Staff Pick
                </div>
            )}
            <CardHeader className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl leading-tight truncate">
                        <a
                            href={rec.link}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline hover:text-primary break-words"
                        >
                            {rec.title}
                        </a>
                    </CardTitle>
                </div>

                <Badge variant="outline" className="w-fit">
                    {rec.genre}
                </Badge>
            </CardHeader>

            <CardContent className="flex-1">
                <p className="text-muted-foreground italic break-words overflow-hidden">
                    &ldquo;{rec.blurb}&rdquo;
                </p>
            </CardContent>

            <CardFooter className="flex h-[60px] w-full items-center justify-between border-t border-border/50 bg-transparent px-6 py-0">
                <span className="text-sm font-medium tracking-tight text-foreground/80 truncate flex-1 mr-2">
                    {rec.authorName}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                    {isAdmin && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleStaffPick(rec._id)}
                            className="h-8 w-8 transition-colors hover:bg-amber-500/10 group/star"
                            title={rec.isStaffPick ? "Remove Staff Pick" : "Make Staff Pick"}
                        >
                            <Star
                                className={`h-[16px] w-[16px] transition-all duration-200 ease-out active:scale-90 
                                    ${rec.isStaffPick
                                        ? "fill-amber-500 text-amber-500"
                                        : "text-muted-foreground/40 group-hover/star:text-amber-500/70 group-hover/star:scale-125"}`}
                            />
                        </Button>
                    )}

                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(rec._id)}
                            className="h-8 w-8 text-muted-foreground/40 transition-all hover:bg-destructive/10 hover:text-destructive"
                            title="Delete Recommendation"
                        >
                            <Trash2 className="h-[16px] w-[16px] transition-transform hover:scale-110" />
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

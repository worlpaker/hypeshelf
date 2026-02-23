import { Badge } from "@/components/ui/badge";
import { GENRES, type Genre } from "@/convex/genres";


interface FilterBadgesProps {
    selected: Genre | "All";
    onSelect: (genre: Genre | "All") => void;
}

export function FilterBadges({ selected, onSelect }: FilterBadgesProps) {
    const options: (Genre | "All")[] = ["All", ...GENRES];
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((g) => (
                <Badge
                    key={g}
                    variant={selected === g ? "default" : "secondary"}
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() => onSelect(g)}
                >
                    {g}
                </Badge>
            ))}
        </div>
    );
}

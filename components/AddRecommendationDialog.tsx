import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { GENRES } from "@/convex/genres";
import { useFormStatus } from "react-dom";

interface AddRecommendationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: FormData) => Promise<void>;
}

function Submit() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sharing..." : "Share with the world"}
        </Button>
    );
}

export function AddRecommendationDialog({
    open,
    onOpenChange,
    onSubmit,
}: AddRecommendationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="lg">
                    Share
                    <Sparkles className="w-4 h-4 mr-2" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-l">
                <DialogHeader>
                    <DialogTitle>What are you hyped about?</DialogTitle>
                </DialogHeader>

                <form action={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
                            <Input
                                name="title"
                                placeholder="Title (e.g. Dune: Part Two)"
                                required
                            />

                            <Select name="genre" required defaultValue={GENRES[0]}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GENRES.map((g) => (
                                        <SelectItem key={g} value={g}>
                                            {g}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Input
                            name="link"
                            type="url"
                            placeholder="Link (e.g., https://dune.two)"
                            required
                        />

                        <Textarea
                            name="blurb"
                            placeholder="Why is it so good in one short sentence? Max 150 characters."
                            required
                            maxLength={150}
                            className="min-h-[120px] w-full resize-none"
                        />
                    </div>

                    <Submit />

                </form>
            </DialogContent>
        </Dialog>
    );
}

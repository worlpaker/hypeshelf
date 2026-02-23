export const GENRES = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Fantasy",
    "Technology",
    "Music",
    "Gaming",
] as const;

export type Genre = typeof GENRES[number];
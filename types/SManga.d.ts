declare type SManga = {
    url: string;
    title: string;
    thumbnailUrl?: string;
    chapters?: SChapter[];
    status?: "ONGOING" | "COMPLETED";
    author?: string | string[];
    artist?: string;
    uploader?: string;
    description?: string;
    tags?: string[];
}

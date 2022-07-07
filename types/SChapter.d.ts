/**
 * Source Chapter, the return type of user script
 */

declare type SChapter = {
    /**
     * url of the chapter
     */
    url: string;
    /**
     * title of the chapter
     */
    title: string;
    /**
     * chapter update time, in milliseconds
     */
    updateAt?: number;
    /**
     * uploader of chapter
     */
    uploader?: string;
    /**
     * pages of the chapter
     */
    pages?: Array<string | SPage>;
}

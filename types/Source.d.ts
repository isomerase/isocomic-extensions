declare interface Source {
    /**
     * user preferences of the source
     *
     * define it only when you need information from user, like username and password to login
     */
    readonly preferenceList?: Preference[]

    /**
     * provide filter for user to select, so can get more type of result
     */
    readonly filterList?: Filter[]

    /**
     * fetch source mangas in main page
     * @param page page number, starts from 1
     * @param filters filter options select by user, included only when `filters` is set
     */
    fetchSourceMangas(page: number, filters?: Filters): Promise<SMangaList>

    /**
     * fetch more detail information of the manga for detail page
     */
    fetchSourceManga(mangaUrl: string): Promise<SManga>

    /**
     * fetch more detail information of the chapter for reader page
     */
    fetchSourceChapter(chapterUrl: string): Promise<SChapter>

    /**
     * search manga by keyword
     * @param keyword non empty string
     * @param page start from 1
     */
    fetchSourceSearchMangas?(keyword: string, page: number, filters?: Filters): Promise<SMangaList>

    /**
     * define this method only if you need to do some post-processing on the manga image
     */
    fetchSourcePage?(pageUrl: string): Promise<SPage>
}
/**
 * Interface of CreateSource
 */
declare type SourceConstructor = {
    new(context: Context): Source
}

/**
 * what index.ts should export
 */
declare type SourceModule = {
    CreateSource: SourceConstructor,
    metadata: SMetadata
}

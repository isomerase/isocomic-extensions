import { MangaListDto, MangaDto } from "./dto/MangaDto"
import { defaultBlockedGroups, MDConstants } from "./MDConstants"
import { MangaDexHelper } from "./MangaDexHelper"
import { ChapterListDto } from "./dto/ChapterDto"
import uniq from "lodash/uniq"
export { default as metadata } from "../metadata.json"


const orderFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "order",
  label: "order",
  entryValues: ["latest", "popular"],
  entryLabels: ["latest", "popular"],
}

const contentRatingFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "contentRating",
  label: "content rating",
  entryValues: ["safe", "suggestive", "erotica", "pornographic"],
  entryLabels: ["safe", "suggestive", "erotica", "pornographic"],
}

const originalLanguageFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "originalLanguage",
  label: "original language",
  entryValues: ["ja", "zh", "ko"],
  entryLabels: ["japanese", "chinese", "korean"],
}

export class CreateSource implements Source {
  filterList = [orderFilter, contentRatingFilter, originalLanguageFilter]

  private lang = "en"
  private fetch: (url: string) => Promise<Response>
  constructor(context: Context) {
    this.fetch = (url: string) => context.xfetch(url)
  }

  private async fetchJSON(url: string) {
    const response = await this.fetch(url)
    const data = await response.json()
    if (data.result === "error") {
      throw new Error(data.errors[0].detail)
    }
    return data
  }

  async fetchSourceMangas(page: number, filters?: Filters): Promise<SMangaList> {
    const order = (filters?.order ?? "latest") as string
    if (order === "latest") {
      return this.fetchSourceLatestMangas(page, filters)
    } else {
      return this.fetchSourcePopularMangas(page, filters)
    }
  }

  /**
   * @param searchParams searchParams to be appended
   * @returns
   */
  private async fetchSouceMangasBasic(url: string): Promise<SMangaList> {
    const mangaListDto = await this.fetchJSON(url) as MangaListDto
    const mangas = parseMangaListDto(mangaListDto, this.lang)
    const totalPage = Math.ceil(mangaListDto.total / mangaListDto.limit)
    return {
      mangas,
      totalPage,
    }
  }

  private async fetchSourcePopularMangas(page: number, filters?: Filters): Promise<SMangaList> {
    const urlObj = this.buildBasicURL(MDConstants.apiMangaUrl, filters)
    urlObj.searchParams.set("includes[]", "cover_art")
    urlObj.searchParams.set("offset", MangaDexHelper.getMangaListOffset(page))
    urlObj.searchParams.set("limit", MDConstants.mangaLimit.toString())
    urlObj.searchParams.set("availableTranslatedLanguage[]", this.lang)
    urlObj.searchParams.set("order[followedCount]", "desc")
    return this.fetchSouceMangasBasic(urlObj.href)
  }

  private buildBasicURL(url: string, filters?: Filters): URL {
    const urlObj = new URL(url)

    if (filters?.[originalLanguageFilter.key]) {
      const lang = filters[originalLanguageFilter.key] as string
      urlObj.searchParams.append("originalLanguage[]", lang)
      if (lang === "zh")
        urlObj.searchParams.append("originalLanguage[]", "zh-hk")
    }

    if (filters?.[contentRatingFilter.key]) {
      urlObj.searchParams.append("contentRating[]", filters[contentRatingFilter.key] as string)
    } else {
      urlObj.searchParams.append("contentRating[]", "safe")
      urlObj.searchParams.append("contentRating[]", "suggestive")
      urlObj.searchParams.append("contentRating[]", "erotica")
      // urlObj.searchParams.append("contentRating[]", "pornographic")
    }

    return urlObj
  }
  private async fetchSourceLatestChapters(page: number, filters?: Filters): Promise<ChapterListDto> {
    const urlObj = this.buildBasicURL(MDConstants.apiChapterUrl, filters)
    urlObj.searchParams.set("limit", MDConstants.latestChapterLimit.toString())
    urlObj.searchParams.set("offset", MangaDexHelper.getLatestChapterOffset(page))
    urlObj.searchParams.set("includeFutureUpdates", "0")
    urlObj.searchParams.set("order[publishAt]", "desc")
    urlObj.searchParams.set("translatedLanguage[]", this.lang)
    defaultBlockedGroups.forEach(groupId => {
      urlObj.searchParams.append("excludedGroups[]", groupId)
    })
    return await this.fetchJSON(urlObj.href) as ChapterListDto
  }

  private async fetchSourceLatestMangas(page: number, filters?: Filters): Promise<SMangaList> {
    const chapterListDto = await this.fetchSourceLatestChapters(page, filters)
    const mangaIds = uniq(chapterListDto.data
      .flatMap(it => it.relationships)
      .filter(it => it.type === MDConstants.manga)
      .map(it => it.id))

    if (mangaIds.length === 0) {
      throw new Error("No manga found")
    }

    const mangaUrlObj = new URL(MDConstants.apiMangaUrl)
    for (const id of mangaIds) {
      mangaUrlObj.searchParams.append("ids[]", id)
    }
    mangaUrlObj.searchParams.set("limit", mangaIds.length.toString())

    mangaUrlObj.searchParams.set("includes[]", "cover_art")
    // fetch all mangas without exception
    mangaUrlObj.searchParams.append("originalLanguage[]", "ja")
    mangaUrlObj.searchParams.append("originalLanguage[]", "ko")
    mangaUrlObj.searchParams.append("originalLanguage[]", "zh")
    mangaUrlObj.searchParams.append("originalLanguage[]", "zh-hk")
    mangaUrlObj.searchParams.append("contentRating[]", "safe")
    mangaUrlObj.searchParams.append("contentRating[]", "suggestive")
    mangaUrlObj.searchParams.append("contentRating[]", "erotica")
    mangaUrlObj.searchParams.append("contentRating[]", "pornographic")
    const { mangas } = await this.fetchSouceMangasBasic(mangaUrlObj.href)
    return {
      mangas,
      totalPage: Infinity
    }
  }

  async fetchSourceManga(mangaUrl: string): Promise<SManga> {
    const urlObj = new URL(mangaUrl)
    urlObj.searchParams.append("includes[]", "cover_art")
    urlObj.searchParams.append("includes[]", "author")
    urlObj.searchParams.append("includes[]", "artist")

    const mangaDto = await this.fetchJSON(urlObj.href) as MangaDto

    const manga = MangaDexHelper.createManga(mangaDto.data, this.lang)
    manga.chapters = await this.fetchActualChapterList(mangaUrl)
    manga.chapters.reverse()
    return manga
  }

  private async fetchActualChapterList(mangaUrl: string, offset: number = 0): Promise<SChapter[]> {
    const urlObj = new URL(`${mangaUrl}/feed`)
    urlObj.searchParams.set("translatedLanguage[]", this.lang)
    urlObj.searchParams.set("limit", "500")
    urlObj.searchParams.set("offset", offset.toString())
    urlObj.searchParams.set("includes[]", MDConstants.scanlator)
    urlObj.searchParams.set("order[volume]", "asc")
    urlObj.searchParams.set("order[chapter]", "asc")
    defaultBlockedGroups.forEach(groupId => {
      urlObj.searchParams.append("excludedGroups[]", groupId)
    })
    const data = await this.fetchJSON(urlObj.href)

    const chapters: SChapter[] = data.data.map((it: any) => {
      const title = [
        it.attributes.volume && `Vol.${it.attributes.volume}`,
        it.attributes.chapter && `Ch.${it.attributes.chapter}`,
        it.attributes.title && `- ${it.attributes.title}`,
      ].filter(it => it).join(" ").replace(/^- /, "")
      return {
        url: `${MDConstants.apiChapterUrl}/${it.id}`,
        title,
        updateAt: Date.parse(it.attributes!.updatedAt),
        uploader: it.relationships.find((rel: any) => rel.type === MDConstants.scanlator)?.attributes.name,
      }
    })

    if (data.total > offset + chapters.length) {
      const moreChapters = await this.fetchActualChapterList(mangaUrl, offset + chapters.length)
      return chapters.concat(moreChapters)
    }
    return chapters
  }

  async fetchSourceChapter(chapterUrl: string): Promise<SChapter> {
    const url = chapterUrl.replace("/chapter/", "/at-home/server/")
    const chapterDto = await this.fetchJSON(url)
    return {
      url: chapterUrl,
      title: "",
      pages: chapterDto.chapter.data
        .map((filename: string) => `${chapterDto.baseUrl}/data/${chapterDto.chapter.hash}/${filename}`)
    }
  }

  async fetchSourceSearchMangas(keyword: string, page: number, filters?: Filters): Promise<SMangaList> {
    const urlObj = this.buildBasicURL(MDConstants.apiMangaUrl, filters)
    urlObj.searchParams.set("title", keyword)
    urlObj.searchParams.set("includes[]", "cover_art")
    urlObj.searchParams.set("offset", MangaDexHelper.getMangaListOffset(page))
    urlObj.searchParams.set("limit", MDConstants.mangaLimit.toString())
    // urlObj.searchParams.set("availableTranslatedLanguage[]", this.lang)
    if (filters?.[orderFilter.key] === "popular") {
      urlObj.searchParams.set("order[followedCount]", "desc")
    } else {
      urlObj.searchParams.set("order[relevance]", "desc")
    }
    return this.fetchSouceMangasBasic(urlObj.href)
  }
}


function parseMangaListDto(mangaListDto: MangaListDto, lang: string): SManga[] {
  const coverSuffix = MDConstants.coverQualityPref

  const mangas = mangaListDto.data.map(mangaDataDto => {
    const relationshipDto = mangaDataDto.relationships.find(it => it.type === "cover_art")

    const coverName = relationshipDto?.attributes?.fileName ?? ""
    return {
      url: `${MDConstants.apiMangaUrl}/${mangaDataDto.id}`,
      title: mangaDataDto.attributes.title[lang] ?? Object.values(mangaDataDto.attributes.title)[0],
      thumbnailUrl: `${MDConstants.cdnUrl}/covers/${mangaDataDto.id}/${coverName}${coverSuffix}`,
    }
  })
  return mangas
}
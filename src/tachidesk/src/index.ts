export { default as metadata } from "../metadata.json"

function range(end: number) {
  return Array.from(Array(end).keys())
}

const categoryFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "category",
  label: "Category",
  entryValues: [],
  entryLabels: [],
}

const sourcesFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "source",
  label: "Source",
  entryValues: [],
  entryLabels: [],
}

const orderFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "order",
  label: "Order",
  entryValues: ["popular", "latest"],
  entryLabels: ["popular", "latest"],
}

const serverPreference: EditTextPreference = {
  type: "EDITTEXT",
  key: "server",
  label: "Server",
}

export class CreateSource implements Source {
  preferenceList = [serverPreference]
  filterList = [categoryFilter, sourcesFilter, orderFilter]
  private baseUrl?: string
  constructor(context: Context) {
    this.baseUrl = context.prefs[serverPreference.key] as string | undefined
    this.setCategoryFilter()
    this.setSources()
  }

  async setCategoryFilter() {
    const url = `${this.baseUrl}/api/v1/category`
    const data = await this.fetchJSON(url)

    categoryFilter.entryValues = data.map((category: any) => category.id)
    categoryFilter.entryLabels = data.map((category: any) => category.name)
  }

  async setSources() {
    const url = `${this.baseUrl}/api/v1/source/list`
    const data = await this.fetchJSON(url)

    sourcesFilter.entryLabels = data.map((source: any) => source.displayName)
    sourcesFilter.entryValues = data.map((source: any) => source.id)
  }

  private async fetchJSON(url: string): Promise<any> {
    if (!url.match("^https?://")) {
      throw new Error(`Invalid url: ${url}`)
    }
    const response = await fetch(url)
    return response.json()
  }

  async fetchSourceMangas(page: number, filters?: Filters): Promise<SMangaList> {
    if (filters?.[sourcesFilter.key]) {
      const sourceId = filters[sourcesFilter.key]

      const order = filters?.[orderFilter.key] ?? "popular"
      const url = `${this.baseUrl}/api/v1/source/${sourceId}/${order}/${page}`

      const data = await this.fetchJSON(url)
      return {
        mangas: this.parseMangaList(data.mangaList),
        totalPage: data.hasNextPage ? page + 1 : page,
      }
    }

    const categoryId = filters?.[categoryFilter.key] ?? "1"
    const url = `${this.baseUrl}/api/v1/category/${categoryId}`
    const data = await this.fetchJSON(url)
    const mangas = this.parseMangaList(data)
    const PAGE_SIZE = 40
    return {
      mangas: mangas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      totalPage: Math.ceil(mangas.length / PAGE_SIZE),
    }
  }

  private parseMangaList(mangaList: any[]) {
    const mangas = mangaList.map((manga: any) => ({
      url: `/api/v1/manga/${manga.id}`,
      thumbnailUrl: this.baseUrl + manga.thumbnailUrl,
      title: manga.title,
    }))
    return mangas
  }

  async fetchSourceManga(mangaUrl: string): Promise<SManga> {
    const chapters = await this.fetchSourceChapterList(mangaUrl)
    const data = await this.fetchJSON(`${this.baseUrl}${mangaUrl}`)
    const manga: SManga = {
      url: mangaUrl,
      title: data.title,
      thumbnailUrl: this.baseUrl + data.thumbnailUrl,
      status: data.status,
      description: data.description,
      author: [data.author, '@' + data.source.displayName].filter(s => !!s),
      artist: data.artist,
      chapters,
      tags: data.genre.filter((tag: string) => !!tag),
    }
    return manga
  }

  async fetchSourceChapterList(mangaUrl: string): Promise<SChapter[]> {
    const url = `${this.baseUrl}${mangaUrl}/chapters`
    const data = await this.fetchJSON(url)
    const chapters = data.map((chapter: any) => ({
      url: `${mangaUrl}/chapter/${chapter.index}`,
      title: chapter.name,
      updateAt: chapter.uploadDate,
    }))
    return chapters
  }

  async fetchSourceChapter(chapterUrl: string): Promise<SChapter> {
    const url = this.baseUrl + chapterUrl
    const data = await this.fetchJSON(url)
    const pages = range(data.pageCount).map((page: number) => this.baseUrl + `${chapterUrl}/page/${page}`)
    const chapter: SChapter = {
      url: chapterUrl,
      title: data.name,
      pages,
    }
    return chapter
  }
}

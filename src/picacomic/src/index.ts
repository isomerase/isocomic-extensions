import { PicaAgent, PicaPrefs } from "./agent"
export { default as metadata } from "../metadata.json"
const baseUrl = "https://picaapi.picacomic.com"

function range(start: number, end: number): number[] {
  return Array.from(Array(end - start).keys()).map(i => i + start)
}

function uniq(arr: string[]): string[] {
  return arr.filter((v, i, a) => a.indexOf(v) === i)
}

// Safari can send custom user-agent, while chrome can't
const isSafari = globalThis.navigator?.userAgent.match(/^((?!chrome|android).)*safari/i) != null

const categories = [
  '大家都在看', '牛牛不哭', '那年今天',
  '官方都在看', '嗶咔漢化', '全彩',
  '長篇', '同人', '短篇',
  '圓神領域', '碧藍幻想', 'CG雜圖',
  '純愛', '百合花園', '後宮閃光',
  '單行本', '姐姐系', '妹妹系',
  'SM', '人妻', 'NTR',
  '強暴', '艦隊收藏', 'Love Live',
  'SAO 刀劍神域', 'Fate', '東方',
  '禁書目錄', 'Cosplay', '英語 ENG',
  '生肉', '性轉換', '足の恋',
  '非人類', '耽美花園', '偽娘哲學',
  '扶他樂園', '重口地帶', '歐美',
  'WEBTOON'
]

const orderFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "order",
  label: "排序",
  entryValues: ["dd", "da", "ld", "vd"],
  entryLabels: ["新到舊", "舊到新", "最多收藏", "最多指名"],
}

const categoryFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "category",
  label: "分類",
  entryValues: categories,
  entryLabels: categories,
}

const frameFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "frame",
  label: "頁面",
  entryValues: [
    "random", "favorites",
    "randomTop"
  ],
  entryLabels: [
    "隨機", "收藏",
    "随机最赞"
  ],
}

const usernamePreference: EditTextPreference = {
  key: "username",
  label: "用戶名",
  type: "EDITTEXT",
  // description: "請使用Safari瀏覽器或手動將user-agent修改為okhttp/3.8.1",
  // description: "游客账户: hiker_share  hiker_share_12345678",
}

const passwordPreference: EditTextPreference = {
  key: "password",
  label: "密碼",
  type: "EDITTEXT",
}

/**
 * it tells how to create a Source from api
 */
export class CreateSource implements Source {
  preferenceList = [usernamePreference, passwordPreference]
  filterList = [frameFilter, orderFilter, categoryFilter]
  private agent: PicaAgent

  constructor(context: Context) {
    // picaapi allow cross-origin request, but need user-agent to be overwritten
    // user-agent can only be overwritten in safari
    // test account
    if (!context.prefs.username && !context.prefs.password) {
      context.prefs.username = "hiker_share"
      context.prefs.password = "hiker_share_12345678"
    }
    this.agent = new PicaAgent(
      // fetch needs to be binded to window on safari
      isSafari ? fetch.bind(window) : context.xfetch,
      context.prefs as PicaPrefs,
    )
  }

  async fetchSourceMangas(page: number, filters?: Filters): Promise<SMangaList> {
    const order = (filters?.[orderFilter.key] ?? "dd") as string
    // notes category can't be empty
    const category = (filters?.[categoryFilter.key]) as string
    let res
    switch (filters?.[frameFilter.key]) {
      case "favorites":
        res = await this.agent.fetchFavoriteComics(page, order)
        break
      case "random":
        res = await this.agent.fetchRandomComics(page)
        break
      case "randomTop":
        res = await this.agent.fetchRandomTopComics(page)
        break
      default:
        res = await this.agent.fetchComics(page, order, category)
    }
    return parseComics(res.data.comics)
  }

  /**
   * @param mangaUrl format like `${baseUrl}/comics/${comicId}`
   */
  private async fetchSourceChapterList(mangaUrl: string): Promise<SChapter[]> {
    const comicId = mangaUrl.split("/").pop()!
    const helper = async (page: number): Promise<[SChapter[], number]> => {
      const res = await this.agent.fetchEpisode(comicId, page)
      let eps = res.data.eps
      let chapters: SChapter[] = eps.docs.map((it) => {
        return {
          title: it.title,
          url: `${mangaUrl}/order/${it.order}`,
          updateAt: Date.parse(it.updated_at),
        } as SChapter
      })
      return [chapters, eps.pages]
    }

    let [chapters, total] = await helper(1)
    if (total > 1) {
      let results = await Promise.all(range(2, total + 1).map(page => helper(page)))
      let restChapters = results.map(it => it[0]).flat()
      chapters = chapters.concat(restChapters)
    }
    return chapters
  }

  /**
 * @param mangaUrl format like `${baseUrl}/comics/${comicId}`
 */
  private async fetchSourceMangaInfo(mangaUrl: string): Promise<SManga> {
    const comicId = mangaUrl.split("/").pop()!
    const res = await this.agent.fetchComic(comicId)
    let comic = res.data.comic
    return {
      url: mangaUrl,
      title: comic.title,
      thumbnailUrl: getPicaImageUrl(comic),
      author: comic.author,
      uploader: comic.chineseTeam, // and comic._creator.name ?
      status: comic.finished ? "COMPLETED" : "ONGOING",
      description: comic.description,
      tags: uniq(
        [...(comic.tags ?? []), ...(comic.categories ?? [])]
          .map(s => s.trim())
      )
    }

  }

  /**
   * @param mangaUrl format like `${baseUrl}/comics/${comicId}`
   */
  async fetchSourceManga(mangaUrl: string): Promise<SManga> {
    // about 200ms for each call
    const [manga, chapters] = await Promise.all([
      this.fetchSourceMangaInfo(mangaUrl),
      this.fetchSourceChapterList(mangaUrl)
    ])
    manga.chapters = chapters
    return manga
  }

  /**
   * @param chapterUrl format like `${baseUrl}/comics/${comicId}/order/${order}`
   */
  async fetchSourceChapter(chapterUrl: string): Promise<SChapter> {
    const order = chapterUrl.split("/").pop()!
    const comicId = chapterUrl.split("/").slice(-3)[0]

    const helper = async (page: number): Promise<[SChapter, number]> => {
      const res = await this.agent.fetchPages(comicId, order, page)
      let pages = res.data.pages
      let pageUrls = pages.docs.map((comic: any) => getPicaImageUrl(comic))
      let chapter = {
        url: chapterUrl,
        title: res.data.ep.title,
        pages: pageUrls
      } as SChapter
      return [chapter, pages.pages]
    }
    let [chapter, total] = await helper(1)
    if (total > 1) {
      let results = await Promise.all(range(2, total + 1).map(page => helper(page)))
      let restPages = results.map(it => it[0].pages!).flat()
      chapter.pages = chapter.pages!.concat(restPages)
    }
    return chapter
  }

  async fetchSourceSearchMangas(keyword: string, page: number, filters?: Filters): Promise<SMangaList> {
    const order = (filters?.order as string) ?? "dd"
    // notes category can't be empty
    const categories = filters?.category ? [filters.category as string] : []
    const res = await this.agent.fetchSearchComics(keyword, page, order, categories)
    return parseComics(res.data.comics)
  }
}


function parseComics(comics: any): SMangaList {
  const arr = comics.docs ? comics.docs : comics
  let mangas: SManga[] = arr.map((comic: any) => {
    return {
      url: `${baseUrl}/comics/${comic._id}`,
      title: comic.title,
      thumbnailUrl: getPicaImageUrl(comic),
      author: comic.author,
      tags: (comic.categories ?? []).concat(comic.tags ?? []),
      status: comic.finished ? "COMPLETED" : "ONGOING",
    }
  })
  return { mangas, totalPage: comics.pages ?? Infinity }
}

function getPicaImageUrl(comic: any): string {
  const obj = comic.thumb ?? comic.media
  const fileServer = obj.fileServer ?? obj.file_server
  const path = obj.path

  if (path.startsWith("tobeimg/")) {
    // avoid 301 redirect
    return `https://img.picacomic.com/${path.replace(/^tobeimg\//, '')}`
  } else {
    return `${fileServer}/static/${path.replace(/^tobs\//, '')}`
  }
}
import { CreateSourceUtil } from "@utils/CreateSourceUtil"
import { query, queryAll, select, selectAll } from "@utils/xray"

export { default as metadata } from "../metadata.json"

const baseUrl = "https://e-hentai.org"

const categories = [
  "doujinshi", "imageset", "non-h", "misc", "western",
  "artistcg", "manga", "cosplay", "gamecg", "asianporn",
]


const categoryFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "category",
  label: "category",
  entryValues: categories,
  entryLabels: categories,
}

const orderFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "order",
  label: "order",
  entryValues: ["latest", "popular"],
  entryLabels: ["latest", "popular"],
}

const languages = [
  "japanese",
  "english",
  "chinese",
  "dutch",
  "french",
  "german",
  "hungarian",
  "italian",
  "korean",
  "polish",
  "portuguese",
  "russian",
  "spanish",
  "thai",
  "vietnamese",
  "n/a",
  "other",
]

const languageFilter: SelectListFilter = {
  type: "SELECTLIST",
  key: "language",
  label: "language",
  entryValues: languages,
  entryLabels: languages,
}

export class CreateSource extends CreateSourceUtil implements Source {
  filterList = [orderFilter, categoryFilter, languageFilter]

  async fetchDOM(url: string, init?: RequestInit): Promise<Document> {
    const response = await this.fetch(url, init)
    const text = await response.text()
    if (text.startsWith("Your IP address")) {
      throw new Error(text)
    }
    return this.parser.parseFromString(text, "text/html")
  }

  async fetchSourceMangas(page: number, filters?: Filters): Promise<SMangaList> {
    const order = (filters?.[orderFilter.key] ?? "latest") as string
    const category = (filters?.[categoryFilter.key] ?? "all") as string
    const lanuage = (filters?.[languageFilter.key] ?? "all") as string
    let url

    if (order === "popular") {
      url = `${baseUrl}/popular`
    } else if (category !== "all") {
      url = `${baseUrl}/${category}/${page}`
    } else {
      url = `${baseUrl}?page=${page - 1}`
      if (lanuage !== "all")
        url += `&f_search=language:${lanuage}`
    }

    const dom = await this.fetchDOM(url)
    return parseSourceMangas(dom)
  }

  async fetchSourceManga(mangaUrl: string): Promise<SManga> {
    const dom = await this.fetchDOM(mangaUrl, {
      headers: { cookie: "nw=1" },
      cache: "force-cache",
    })

    const manga: SManga = select(dom, {
      url: () => mangaUrl,
      title: "#gn",
      description: "#gj", // original title
      thumbnailUrl: () => query(dom, "#gd1 div@style").match(/url\((.*)\)/)?.[1],
      tags: () => queryAll(dom, "#taglist div@id")
        .map(s => s.replace("td_", "").replace("_", " ")),
    })

    const postAt: number = Date.parse(query(dom, ".gdt2"))

    manga.chapters = selectAll(dom, ".ptt a", {
      url: "@href",
      title: "@text",
      updateAt: () => postAt,
    })
      .filter(c => !"<>".includes(c.title))
      .reverse()

    return manga
  }

  async fetchSourceChapter(chapterUrl: string): Promise<SChapter> {
    const dom = await this.fetchDOM(chapterUrl, {
      cache: "force-cache",
    })
    const page = parseInt(new URL(chapterUrl).searchParams.get("p") ?? "0") + 1
    const chapter: SChapter = {
      url: chapterUrl,
      title: page.toString(),
      pages: queryAll(dom, "#gdt a@href")
    }
    return chapter
  }

  async fetchSourcePage(url: string): Promise<SPage> {
    const dom = await this.fetchDOM(url, {
      cache: "force-cache",
    })
    return {
      url: query(dom, "#img@src"),
      type: "image",
    }
  }

  async fetchSourceSearchMangas(keyword: string, page: number): Promise<SMangaList> {
    const url = `${baseUrl}/?page=${page - 1}&f_search=${keyword}`
    const dom = await this.fetchDOM(url)
    return parseSourceMangas(dom)
  }
}


function parseSourceMangas(dom: Document): SMangaList {
  const mangas = selectAll(dom, "table.itg td.glname", {
    url: "a@href",
    title: ".glink",
    thumbnailUrl: (el) => query(el.parentElement!, ".glthumb img@data-src")
      || query(el.parentElement!, ".glthumb img@src"),
    tags: (el) => queryAll(el, ".gt@title"),
  })

  const pagers = queryAll(dom, ".ptt a").filter(s => !"<>".includes(s))

  const totalPage = parseInt(pagers.length > 0 ? pagers.at(-1)! : "1")
  return {
    mangas,
    totalPage,
  }
}
import { CreateSourceUtil } from "@utils/CreateSourceUtil";
import { selectAll } from "@utils/xray";

export { default as metadata } from "../metadata.json";
const baseUrl = "https://www.template.com";

export class CreateSource extends CreateSourceUtil implements Source {
  async fetchSourceMangas(page: number): Promise<SMangaList> {
    const dom = await this.fetchDOM(`${baseUrl}`)
    const mangas = selectAll(dom, ".item", {
      url: "a@href",
      title: "a",
      thumbnailUrl: "img@src",
    })
    return {
      mangas,
      totalPage: 1,
    }
  }

  async fetchSourceManga(mangaUrl: string): Promise<SManga> {
    const chapters = [{
      url: mangaUrl,
      title: "1",
    }]
    const manga: SManga = {
      url: mangaUrl,
      title: "",
      thumbnailUrl: "",
      chapters,
    }
    return manga
  }

  async fetchSourceChapter(chapterUrl: string): Promise<SChapter> {
    const pages: string[] = []
    const chapter: SChapter = {
      url: chapterUrl,
      title: "",
      pages,
    }
    return chapter
  }
}

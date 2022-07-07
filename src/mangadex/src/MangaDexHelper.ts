import { ChapterDataDto } from "./dto/ChapterDto"
import { getTag } from "./MangaDexFilters"
import { MangaDataDto } from "./dto/MangaDto"
import { MDConstants } from "./MDConstants"

export class MangaDexHelper {
  static getMangaListOffset(page: number): string {
    return (MDConstants.mangaLimit * (page - 1)).toString()
  }
  static getLatestChapterOffset(page: number): string {
    return (MDConstants.latestChapterLimit * (page - 1)).toString()
  }

  static createManga(mangaDataDto: MangaDataDto, lang: string): SManga {
    const fileName = mangaDataDto.relationships.find(it => it.type === "cover_art")?.attributes?.fileName

    const authors: string[] = mangaDataDto.relationships
      .filter(it => it.type === "author")
      .map(it => it.attributes!.name!)
      .filter((value, index, self) => self.indexOf(value) === index)
    const artists: string[] = mangaDataDto.relationships
      .filter(it => it.type === "artist")
      .map(it => it.attributes!.name!)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter(s => !authors.includes(s))

    return {
      url: `${MDConstants.apiUrl}/manga/${mangaDataDto.id}`,
      title: mangaDataDto.attributes.title[lang],
      thumbnailUrl: `${MDConstants.cdnUrl}/covers/${mangaDataDto.id}/${fileName}${MDConstants.coverQualityPref}`,
      author: authors.join(" "),
      artist: artists.join(" "),
      description: mangaDataDto.attributes.description[lang],
      tags: mangaDataDto.attributes.tags.map(it => getTag(it.id)),
    }
  }

  static createChapter(chapterDataDto: ChapterDataDto): SChapter {
    const attr = chapterDataDto.attributes
    return {
      url: `${MDConstants.apiChapterUrl}/${chapterDataDto.id}`,
      title: attr.title!,
      updateAt: Date.parse(attr.publishAt),
    }
  }
}
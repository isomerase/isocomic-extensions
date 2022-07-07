import { RelationshipDto } from "./MangaDto"

export interface ChapterListDto {
  limit: number
  offset: number
  total: number
  data: ChapterDataDto[],
}

export interface ChapterDto {
  result: string,
  data: ChapterDataDto,
}

export interface ChapterDataDto {
  id: string,
  type: string,
  attributes: ChapterAttributesDto,
  relationships: RelationshipDto[],
}

export interface ChapterAttributesDto {
  title?: string,
  volume?: string,
  chapter?: string,
  publishAt: string,
  data: string[],
  dataSaver: string[],
  hash: string,
  externalUrl?: string,
}

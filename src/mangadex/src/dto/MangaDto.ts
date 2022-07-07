export interface MangaListDto {
  limit: number
  offset: number
  total: number
  data: MangaDataDto[]
}

export interface MangaDto {
  result: string
  data: MangaDataDto
}

export interface RelationshipDto {
  id: string
  type: string
  attributes?: IncludesAttributesDto
}

export interface IncludesAttributesDto {
  name?: string
  fileName?: string
}

export interface MangaDataDto {
  id: string
  type: string
  attributes: MangaAttributesDto
  relationships: RelationshipDto[]
}

export interface MangaAttributesDto {
  title: any
  altTitles: any
  description: any
  originalLanguage: string
  lastVolume?: string
  lastChapter?: string
  contentRating?: string
  publicationDemographic?: string
  status?: string
  tags: TagDto[]
}

export interface TagDto {
  id: string
}
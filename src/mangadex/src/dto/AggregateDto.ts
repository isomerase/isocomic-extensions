export interface AggregateDto {
  result: string,
  volumes: {
    [key: string]: AggregateVolume
  }
}

export interface AggregateVolume {
  volume: string,
  count: string,
  chapters: {
    [key: string]: AggregateChapter
  }
}

export interface AggregateChapter {
  chapter: string,
  count: string,
  id: string,
}

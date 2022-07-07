export interface AtHomeDto {
  baseUrl: string
}

export interface ImageReportDto {
  url: string,
  success: boolean,
  bytes?: number,
  cached: boolean,
  duration: number,
}

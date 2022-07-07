const apiUrl = "https://api.mangadex.org"
export const coverQualityMap = {
  "Original": "",
  "Medium": ".512.jpg",
  "Low": ".256.jpg",
}

export const MDConstants = {
  mangaLimit: 20,
  latestChapterLimit: 100, // can't be more, otherwise url length will exceed the limitaion

  manga: "manga",
  coverArt: "cover_art",
  scanlator: "scanlation_group",
  author: "author",
  artist: "artist",

  cdnUrl: "https://uploads.mangadex.org",
  apiUrl: apiUrl,
  apiMangaUrl: `${apiUrl}/manga`,
  apiChapterUrl: `${apiUrl}/chapter`,
  atHomePostUrl: "https://api.mangadex.network/report",

  mdAtHomeTokenLifespan: 5 * 60 * 1000,

  prefixIdSearch: "id:",
  prefixChSearch: "ch:",

  coverQualityPref: ".256.jpg",

  getCoverQualityPreferenceKey: function (dexLang: string): string {
    return `${MDConstants.coverQualityPref}_${dexLang}`
  },

  dataSaverPref: "dataSaverV5",
}

export const langCodeMap = {
  "en": "en",
  "ja": "ja",
  "pl": "pl",
  "sh": "sh",
  "nl": "nl",
  "it": "it",
  "ru": "ru",
  "de": "de",
  "hu": "hu",
  "fr": "fr",
  "fi": "fi",
  "vi": "vi",
  "el": "el",
  "bg": "bg",
  "es": "es",
  "pt": "pt",
  "sv": "sv",
  "ar": "ar",
  "da": "da",
  "bn": "bn",
  "ro": "ro",
  "cs": "cs",
  "mn": "mn",
  "tr": "tr",
  "id": "id",
  "ko": "ko",
  "fa": "fa",
  "ms": "ms",
  "th": "th",
  "ca": "ca",
  "uk": "uk",
  "my": "my",
  "lt": "lt",
  "he": "he",
  "hi": "hi",
  "no": "no",
  "pt-BR": "pt-br",
  "zh-Hans": "zh",
  "es-419": "es-la",
  "fil": "tl",
  "zh-Hant": "zh-hk",
  "other": "NULL",
}


const groupMangaPlus = "4f1de6a2-f0c5-4ac5-bce5-02c7dbb67deb"
const groupComikey = "8d8ecf83-8d42-4f8c-add8-60963f9f28d9"
const groupBilibili = "06a9fecb-b608-4f19-b93c-7caab06b7f44"
const groupAzuki = "5fed0576-8b94-4f9a-b6a7-08eecd69800d"
const groupMangaHot = "319c1b10-cbd0-4f55-a46e-c4ee17e65139"
export const defaultBlockedGroups = [groupMangaPlus, groupComikey, groupBilibili, groupAzuki, groupMangaHot]
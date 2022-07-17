import { buildHeaders, isTokenExpired } from "./utils"
import { RootObject as ComicsResponse } from "./interfaces/comics"
import { RootObject as RandomResponse } from "./interfaces/random"
import { RootObject as ComicResponse } from "./interfaces/comic"
import { RootObject as PagesResponse } from "./interfaces/pages"
import { RootObject as EpsResponse } from "./interfaces/eps"

const baseUrl = "https://picaapi.picacomic.com"

type Fetch = (url: string, init?: RequestInit) => Promise<Response>
export type PicaPrefs = { username?: string, password?: string, token?: string }

export class PicaAgent {
  private isSignIn: boolean = false
  constructor(private xfetch: Fetch, private store: PicaPrefs) {
    this.store = store;
    this.xfetch = xfetch;
  }

  private async signIn() {
    if (this.isSignIn) return

    if (!this.store.token || isTokenExpired(this.store.token)) {
      if (!this.store.username || !this.store.password) {
        throw new Error("username or password is empty")
      }
      this.store.token = await this.fetchToken(this.store.username, this.store.password)
    }
    this.isSignIn = true
  }

  private async fetch(url: string, init?: RequestInit) {
    await this.signIn()
    const method = init?.method ?? "GET";
    const headers = buildHeaders(url, method);
    headers.append('authorization', this.store.token!);
    return this.xfetch(url, { ...init, headers });
  }

  private async fetchJSON(url: string, init?: RequestInit) {
    const response = await this.fetch(url, init)
    const res = await response.json()
    if (res.code !== 200) {
      throw new Error(res.message)
    }
    return res
  }

  async fetchComics(page: number, order: string = "dd", category: string = ""): Promise<ComicsResponse> {
    // notes category can't be empty
    let url = `${baseUrl}/comics?page=${page}&s=${order}`
    if (category)
      url += `&c=${encodeURIComponent(category)}`
    return this.fetchJSON(url)
  }

  /**
   * note the thumbnail of results are larger than thumbnail in info page
   */
  async fetchFavoriteComics(page: number, order: string = "dd",): Promise<ComicsResponse> {
    const url = `${baseUrl}/users/favourite?s=${order}&page=${page}`
    return this.fetchJSON(url)
  }

  async fetchRandomComics(page: number): Promise<RandomResponse> {
    const url = `${baseUrl}/comics/random?page=${page}`
    return this.fetchJSON(url)
  }

  async fetchRandomTopComics(page: number): Promise<RandomResponse> {
    const res = await this.fetchRandomComics(page)
    const comics = res.data.comics
    comics.sort((c1, c2) => c1.likesCount - c2.likesCount)
    res.data.comics = comics.slice(-3) // 3 of 20
    return res
  }

  async fetchEpisode(comicId: string, page: number): Promise<EpsResponse> {
    const url = `${baseUrl}/comics/${comicId}/eps?page=${page}`
    return this.fetchJSON(url)
  }

  async fetchComic(comicId: string): Promise<ComicResponse> {
    const url = `${baseUrl}/comics/${comicId}`
    return this.fetchJSON(url)
  }

  async fetchPages(comicId: string, order: string, page: number): Promise<PagesResponse> {
    const url = `${baseUrl}/comics/${comicId}/order/${order}/pages?page=${page}`
    return this.fetchJSON(url)
  }

  async fetchSearchComics(keyword: string, page: number, order: string = "dd", categories: string[] = []): Promise<any> {
    const url = `${baseUrl}/comics/advanced-search?page=${page}`
    return await this.fetchJSON(url, {
      method: "POST",
      body: JSON.stringify({
        keyword: keyword,
        categories: categories,
        sort: order,
      })
    })
  }

  async fetchToken(username: string, password: string): Promise<string> {
    const url = `${baseUrl}/auth/sign-in`;
    // use xfetch to avoid recursive call
    const response = await this.xfetch(url, {
      method: 'POST',
      headers: buildHeaders(url, "POST"),
      body: JSON.stringify({
        email: username,
        password
      })
    });

    const res = await response.json();
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    if (!res.data?.token) {
      throw new Error("Invalid username or password");
    }
    return res.data.token
  }
}
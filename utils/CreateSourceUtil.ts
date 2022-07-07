export class CreateSourceUtil {
  xfetch: (url: string, init?: RequestInit) => Promise<Response>
  parser: DOMParser
  prefs: Preferences
  constructor(context: Context) {
    this.xfetch = context.xfetch
    this.parser = context.domParser
    this.prefs = context.prefs
  }

  async fetch(url: string, init?: RequestInit): Promise<Response> {
    return this.xfetch(url, init)
  }

  async fetchDOM(url: string, init?: RequestInit): Promise<Document> {
    const response = await this.fetch(url, init)
    let text = await response.text()
    const dom = this.parser.parseFromString(text, "text/html")
    // set baseUri
    const base = dom.createElement("base")
    base.href = url
    dom.head.appendChild(base)

    return dom
  }
}

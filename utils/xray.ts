// a simple re-implement of [x-ray](https://github.com/matthewmueller/x-ray)

type Mapper = (el: Element | Document) => any

type CastToValue<T> = {
  [key in keyof T]: T[key] extends Mapper ? ReturnType<T[key]> : string
}

type ScraperModel = Record<string, string | Mapper>

export function select<T extends ScraperModel>(
  el: Element | Document,
  model: T
): CastToValue<T> {
  const res = {} as any
  for (let key in model) {
    const value = model[key]
    if (value instanceof Function) {
      res[key] = value(el)
    } else if (typeof value === "string") {
      res[key] = query(el, value)
    } else {
      throw new Error(`Invalid rule: ${value}`)
    }
  }
  return res
}

export function selectAll<T extends ScraperModel>(
  dom: Document | Element,
  scope: string,
  model: T,
) {
  return Array.from(dom.querySelectorAll<HTMLElement>(scope))
    .map(el => select(el, model))
}

export function query(dom: Document | Element, selector: string): string {
  const [sel, attr] = selector.split('@')
  const el = sel ? dom.querySelector<HTMLElement>(sel) : (dom as HTMLElement)

  if (!el) return ""
  return getAttr(el, attr)
}

export function queryAll(dom: Document | Element, selector: string): string[] {
  const [sel, attr] = selector.split('@')
  return Array.from(dom.querySelectorAll<HTMLElement>(sel))
    .map(el => getAttr(el, attr))
}


function getAttr(el: HTMLElement, attr: string): string {
  if (!attr || attr === "text") {
    return el.innerText?.trim() ?? ""
  }

  if (attr === "html") {
    return el.innerHTML.trim() ?? ""
  }

  if (attr.startsWith('data-')) {
    return el.dataset[attr.slice('data-'.length)] ?? ""
  }

  return el.getAttribute(attr) ?? ""
}
import {int} from "@opendaw/lib-std"

export const toSlug = (name: string): string => name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

// Maps each mix to a path (/<slug>) and keeps the address bar in sync without adding history entries.
export class Router {
    readonly #slugs: ReadonlyArray<string>
    readonly #titles: ReadonlyArray<string>
    readonly #baseTitle: string

    #current: int = -1

    constructor(names: ReadonlyArray<string>) {
        this.#slugs = names.map(toSlug)
        this.#titles = names
        this.#baseTitle = document.title
    }

    get current(): int {return this.#current}

    // Returns the index of the mix addressed by the current location or -1 if there is none.
    resolve(): int {
        const slug = decodeURIComponent(location.pathname).replace(/^\/+|\/+$/g, "").toLowerCase()
        return this.#slugs.indexOf(slug)
    }

    replace(index: int): void {
        if (index === this.#current || index < 0 || index >= this.#slugs.length) {return}
        this.#current = index
        const path = `/${this.#slugs[index]}`
        if (location.pathname !== path) {
            history.replaceState(null, "", `${path}${location.search}`)
        }
        document.title = `${this.#titles[index]} · ${this.#baseTitle}`
    }
}

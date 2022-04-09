class TldrawImage extends HTMLImageElement {
  constructor(url: string) {
    super()

    this.setUrl(url)
  }

  hide() {
    this.style.display = 'none'
  }
  show() {
    this.style.display = 'inherit'
  }

  setUrl(url: string) {
    this.setAttribute('src', url)
  }
}

customElements.define('word-count', TldrawImage, { extends: 'img' })

// @ts-ignore
const element: TldrawImage = customElements.get('word-count')

export { element as TldrawImage }

import * as React from 'react'
import {
  Tldraw,
  TldrawApp,
  TDShapeType,
  ColorStyle,
  TDDocument,
  TDExportTypes,
} from '@tldraw/tldraw'
import ReactDOM from 'react-dom'
import { openDocument } from './openDocument'
import { prevent_default } from 'svelte/internal'
import { prefersDarkMode } from '../prefersDarkMode'
import { dataURLtoFile } from './dataURLtoFile'

const convertToMap = (arr: any[]) =>
  Object.fromEntries(arr.map((all) => [all.id, all]))

const shapes = Object.fromEntries(
  [
    {
      id: '9ae2536d-1083-4132-2ce0-1394f638e91e',
      type: 'rectangle',
      name: 'Rectangle',
      parentId: 'page',
      childIndex: 1,
      point: [453, 265.93],
      size: [42, 32],
      rotation: 0,
      style: {
        color: 'black',
        size: 'small',
        isFilled: false,
        dash: 'draw',
        scale: 1,
      },
      label: '',
      labelPoint: [0.5, 0.5],
    },
  ].map((all) => [all.id, all])
)

const clip = {
  type: 'tldr/clipboard',
  shapes: [
    {
      id: '0ea4e8dd-11c7-4b3d-206d-100e9ae6f560',
      type: 'image',
      name: 'Image',
      parentId: 'page',
      childIndex: 1,
      point: [769, 329],
      size: [106, 265],
      rotation: 0,
      style: {
        color: 'black',
        size: 'small',
        isFilled: false,
        dash: 'draw',
        scale: 1,
      },
      assetId: '7b4372bf-f8c8-4e99-13f7-7535ee6d913a',
    },
  ],
  bindings: [],
  assets: [
    {
      id: '7b4372bf-f8c8-4e99-13f7-7535ee6d913a',
      type: 'image',
      src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDYgMjY1IiB3aWR0aD0iNzQiIGhlaWdodD0iMjMzIiBmaWxsPSJ0cmFuc3BhcmVudCI+PGRlZnM+PHN0eWxlPkBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUNhdmVhdCtCcnVzaCZhbXA7ZmFtaWx5PVNvdXJjZStDb2RlK1BybyZhbXA7ZmFtaWx5PVNvdXJjZStTYW5zK1BybyZhbXA7ZmFtaWx5PUNyaW1zb24rUHJvJmFtcDtkaXNwbGF5PWJsb2NrJyk7PC9zdHlsZT48L2RlZnM+PGcgaWQ9IjJlYjhkNWE2LTNhZDctNDc3YS0zYzg5LTdlN2EzYWE2Yjg3Yl9zdmciIGNsYXNzPSJ0bC1jZW50ZXJlZC1nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNCwgMTYpIHJvdGF0ZSgwLCAxMS41LCAyMCkiPjxnIG9wYWNpdHk9IjEiPjxwYXRoIGQ9Ik0gMi4wNCwtMS4zNiBRIDIuMDQsLTEuMzYgMy4yNCwwLjc0IDQuNDQsMi44NSA1LjM1LDUuMDUgNi4yNyw3LjI0IDcuMTQsOS4wMiA4LjAxLDEwLjgxIDguNjQsMTIuMDUgOS4yNywxMy4yOCAxMC41MywxNS4xNiAxMS43OSwxNy4wMyAxMi42MywxOC4zMyAxMy40NywxOS42MyAxNC40OCwyMS4zNyAxNS40OSwyMy4xMiAxNi43NSwyNS4wMSAxOC4wMSwyNi45MCAxOS4yNCwyOC4yNyAyMC40OCwyOS42MyAyMS42NCwzMS4xNiAyMi44MSwzMi42OSAyMy41NCwzNC4yNyAyNC4yOCwzNS44NSAyNC45NSwzNy40MSAyNS42MiwzOC45NyAyNS43MSwzOS40MSAyNS44MSwzOS44NiAyNS43NSw0MC4zMSAyNS43MCw0MC43NiAyNS41MSw0MS4xOCAyNS4zMSw0MS41OSAyNS4wMCw0MS45MiAyNC42OCw0Mi4yNSAyNC4yOCw0Mi40NiAyMy44OCw0Mi42NyAyMy40Myw0Mi43NCAyMi45OCw0Mi44MSAyMi41Myw0Mi43MyAyMi4wOCw0Mi42NiAyMS42OCw0Mi40NCAyMS4yOCw0Mi4yMiAyMC45Nyw0MS44OSAyMC42Niw0MS41NiAyMC40Nyw0MS4xNCAyMC4yOCw0MC43MyAyMC4yMyw0MC4yOCAyMC4xOSwzOS44MyAyMC4yOSwzOS4zOCAyMC4zOSwzOC45NCAyMC42MywzOC41NSAyMC44NiwzOC4xNiAyMS4yMSwzNy44NyAyMS41NiwzNy41OCAyMS45OCwzNy40MSAyMi40MSwzNy4yNCAyMi44NiwzNy4yMiAyMy4zMiwzNy4yMCAyMy43NSwzNy4zMiAyNC4xOSwzNy40NSAyNC41NywzNy43MSAyNC45NCwzNy45NiAyNS4yMiwzOC4zMyAyNS40OSwzOC42OSAyNS42MywzOS4xMyAyNS43NywzOS41NiAyNS43Nyw0MC4wMSAyNS43Nyw0MC40NyAyNS42Miw0MC45MCAyNS40Nyw0MS4zMyAyNS4xOSw0MS42OSAyNC45Miw0Mi4wNSAyNC41NCw0Mi4zMCAyNC4xNiw0Mi41NiAyMy43Miw0Mi42NyAyMy4yOCw0Mi43OSAyMi44Myw0Mi43NyAyMi4zNyw0Mi43NCAyMS45NSw0Mi41NyAyMS41Myw0Mi40MCAyMS4xOCw0Mi4xMCAyMC44NCw0MS44MCAyMC42MSw0MS40MSAyMC4zNyw0MS4wMiAyMC4zNyw0MS4wMiAyMC4zNyw0MS4wMiAxOS40OCwzOC41MCAxOC41OCwzNS45NyAxNy41OSwzNC41MiAxNi41OSwzMy4wNyAxNS4zMiwzMS41MCAxNC4wNSwyOS45MyAxMy4xNSwyOC43NyAxMi4yNSwyNy42MCAxMS4xOCwyNS4yNSAxMC4xMCwyMi45MCA5LjU5LDIxLjY5IDkuMDgsMjAuNDcgOC4zNCwxOC44OCA3LjYwLDE3LjI4IDYuMzcsMTQuODQgNS4xNCwxMi4zOSA0LjA0LDEwLjYxIDIuOTUsOC44NCAxLjk0LDcuMDEgMC45Miw1LjE5IC0wLjU1LDMuMjcgLTIuMDQsMS4zNiAtMi4xNywxLjA5IC0yLjMxLDAuODMgLTIuMzcsMC41NCAtMi40NCwwLjI1IC0yLjQ0LC0wLjAzIC0yLjQzLC0wLjMzIC0yLjM1LC0wLjYyIC0yLjI4LC0wLjkwIC0yLjE0LC0xLjE2IC0yLjAwLC0xLjQyIC0xLjgwLC0xLjY0IC0xLjYwLC0xLjg2IC0xLjM1LC0yLjAzIC0xLjEwLC0yLjE5IC0wLjgyLC0yLjI5IC0wLjU0LC0yLjM5IC0wLjI1LC0yLjQyIDAuMDMsLTIuNDUgMC4zMywtMi40MSAwLjYyLC0yLjM3IDAuOTAsLTIuMjYgMS4xNywtMi4xNSAxLjQxLC0xLjk4IDEuNjUsLTEuODEgMS44NSwtMS41OCBaIiBmaWxsPSIjMWQxZDFkIiBzdHJva2U9IiMxZDFkMWQiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBwb2ludGVyLWV2ZW50cz0ibm9uZSIvPjwvZz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYsIDE4Nikgcm90YXRlKDAsIDM3LCAzMS41KSI+PGcgaWQ9IjhkMTlmNjQ1LTE4OTAtNDJhMC0zM2U3LWI0NmU1OTlmZTQ0MV9zdmciIGNsYXNzPSJ0bC1jZW50ZXJlZC1nIj48cGF0aCBkPSJNIDc0LjU1LDQzLjE3IFEgNzQuNTUsNDMuMTcgNzQuNjcsNDYuMDEgNzQuODAsNDguODUgNzQuOTIsNTIuNDkgNzUuMDQsNTYuMTIgNzMuMjYsNTkuMDMgNzEuNDgsNjEuOTMgNjcuMzMsNjIuNzEgNjMuMTcsNjMuNDkgNTguNzMsNjMuNTcgNTQuMjgsNjMuNjUgNDkuNzYsNjMuNjAgNDUuMjQsNjMuNTYgNDAuNzAsNjMuNTggMzYuMTYsNjMuNTkgMzEuNjEsNjMuNzAgMjcuMDYsNjMuODAgMjIuNTEsNjMuOTAgMTcuOTYsNjQuMDEgMTMuMzYsNjQuMDkgOC43NSw2NC4xOCA1LjYxLDYyLjQyIDIuNDgsNjAuNjYgMS41OSw1Ny4wMyAwLjcwLDUzLjQxIDAuNTYsNDkuNjEgMC40Miw0NS44MCAwLjQyLDQxLjk3IDAuNDIsMzguMTUgMC4zNiwzNC4zMSAwLjMwLDMwLjQ4IDAuMTYsMjYuNjQgMC4wMSwyMi44MCAtMC4xMiwxOC45NiAtMC4yNiwxNS4xMiAtMC4zOCwxMS4yMiAtMC41MSw3LjMxIDEuMjcsNC4zNCAzLjA1LDEuMzYgNy4yMCwwLjU4IDExLjM2LC0wLjE4IDE1LjgwLC0wLjI0IDIwLjI1LC0wLjMwIDI0Ljc3LC0wLjI0IDI5LjI5LC0wLjE3IDMzLjgzLC0wLjE2IDM4LjM3LC0wLjE1IDQyLjkyLC0wLjIzIDQ3LjQ3LC0wLjMxIDUyLjAyLC0wLjM4IDU2LjU3LC0wLjQ2IDYxLjE4LC0wLjUyIDY1Ljc4LC0wLjU4IDY4LjkxLDEuMTggNzIuMDUsMi45NCA3Mi45NCw2LjU1IDczLjgzLDEwLjE1IDczLjk3LDEzLjk0IDc0LjExLDE3LjcyIDc0LjExLDIxLjUyIDc0LjEwLDI1LjMyIDc0LjE2LDI5LjEzIDc0LjIyLDMyLjk0IDc0LjM3LDM2Ljc1IDc0LjUxLDQwLjU2IDc0LjY3LDQ1LjY4IDc0LjgzLDUwLjgwIDc0Ljc5LDUxLjAzIDc0Ljc2LDUxLjI3IDc0LjY1LDUxLjQ4IDc0LjU0LDUxLjY5IDc0LjM3LDUxLjg1IDc0LjIwLDUyLjAyIDczLjk5LDUyLjEyIDczLjc3LDUyLjIyIDczLjU0LDUyLjI1IDczLjMwLDUyLjI4IDczLjA3LDUyLjIzIDcyLjg0LDUyLjE5IDcyLjYzLDUyLjA3IDcyLjQzLDUxLjk1IDcyLjI3LDUxLjc3IDcyLjEyLDUxLjU5IDcyLjAzLDUxLjM3IDcxLjk0LDUxLjE1IDcxLjkyLDUwLjkxIDcxLjkxLDUwLjY4IDcxLjk3LDUwLjQ1IDcyLjAzLDUwLjIyIDcyLjE2LDUwLjAyIDcyLjI5LDQ5LjgyIDcyLjQ3LDQ5LjY4IDcyLjY2LDQ5LjUzIDcyLjg4LDQ5LjQ1IDczLjExLDQ5LjM4IDczLjM1LDQ5LjM3IDczLjU4LDQ5LjM3IDczLjgxLDQ5LjQ0IDc0LjAzLDQ5LjUyIDc0LjIyLDQ5LjY2IDc0LjQxLDQ5LjgwIDc0LjU1LDQ5Ljk5IDc0LjY4LDUwLjE5IDc0Ljc1LDUwLjQxIDc0LjgyLDUwLjY0IDc0LjgxLDUwLjg4IDc0LjgwLDUxLjEyIDc0LjcxLDUxLjM0IDc0LjYzLDUxLjU2IDc0LjQ4LDUxLjc0IDc0LjMzLDUxLjkyIDc0LjEyLDUyLjA1IDczLjkyLDUyLjE3IDczLjY5LDUyLjIzIDczLjQ2LDUyLjI4IDczLjIzLDUyLjI2IDcyLjk5LDUyLjIzIDcyLjc3LDUyLjE0IDcyLjU2LDUyLjA0IDcyLjM4LDUxLjg4IDcyLjIxLDUxLjcyIDcyLjEwLDUxLjUxIDcxLjk4LDUxLjMwIDcxLjk0LDUxLjA3IDcxLjkwLDUwLjg0IDcxLjkwLDUwLjg0IDcxLjkwLDUwLjg0IDcxLjkzLDQ1LjcyIDcxLjk1LDQwLjYwIDcyLjAwLDM2Ljc4IDcyLjA0LDMyLjk3IDcxLjk4LDI5LjE3IDcxLjkyLDI1LjM3IDcxLjc0LDIxLjYyIDcxLjU1LDE3Ljg3IDcxLjI2LDE0LjMyIDcwLjk2LDEwLjc4IDcwLjQzLDcuOTQgNjkuOTAsNS4xMCA2Ny43MywzLjg4IDY1LjU2LDIuNjUgNjEuMDYsMi41NiA1Ni41NiwyLjQ2IDUyLjAxLDIuMzUgNDcuNDYsMi4yNCA0Mi45MiwyLjEzIDM4LjM3LDIuMDIgMzMuODMsMi4wMiAyOS4zMCwyLjAxIDI0LjgyLDIuMTMgMjAuMzQsMi4yNCAxNi4wOCwyLjQ3IDExLjgyLDIuNzAgOC40NCwzLjE1IDUuMDYsMy42MSAzLjg5LDUuNTcgMi43MSw3LjUzIDIuNjksMTEuMzEgMi42NiwxNS4wOSAyLjYyLDE4LjkzIDIuNTcsMjIuNzcgMi41MywyNi42MSAyLjQ5LDMwLjQ0IDIuNTUsMzQuMjcgMi42MCwzOC4xMCAyLjc5LDQxLjg3IDIuOTcsNDUuNjUgMy4yNyw0OS4yMiAzLjU2LDUyLjc5IDQuMDksNTUuNjUgNC42Myw1OC41MSA2Ljc5LDU5LjcyIDguOTUsNjAuOTMgMTMuNDUsNjEuMDEgMTcuOTUsNjEuMDggMjIuNTAsNjEuMTYgMjcuMDUsNjEuMjQgMzEuNjAsNjEuMzMgMzYuMTUsNjEuNDEgNDAuNjgsNjEuMzkgNDUuMjIsNjEuMzcgNDkuNzAsNjEuMjMgNTQuMTgsNjEuMDkgNTguNDQsNjAuODQgNjIuNzAsNjAuNjAgNjYuMDgsNjAuMTQgNjkuNDYsNTkuNjggNzAuNjQsNTcuNzggNzEuODIsNTUuODkgNzEuODUsNTIuMzkgNzEuODcsNDguODkgNzEuOTMsNDYuMDUgNzEuOTksNDMuMjEgNzIuMDEsNDMuMDUgNzIuMDIsNDIuOTAgNzIuMDcsNDIuNzUgNzIuMTMsNDIuNjEgNzIuMjEsNDIuNDggNzIuMzAsNDIuMzUgNzIuNDEsNDIuMjUgNzIuNTMsNDIuMTUgNzIuNjYsNDIuMDcgNzIuODAsNDIuMDAgNzIuOTUsNDEuOTYgNzMuMTAsNDEuOTIgNzMuMjUsNDEuOTIgNzMuNDEsNDEuOTIgNzMuNTYsNDEuOTUgNzMuNzEsNDEuOTkgNzMuODQsNDIuMDYgNzMuOTgsNDIuMTMgNzQuMTAsNDIuMjMgNzQuMjEsNDIuMzMgNzQuMzAsNDIuNDYgNzQuMzksNDIuNTggNzQuNDUsNDIuNzIgNzQuNTAsNDIuODcgNzQuNTMsNDMuMDIgWiIgZmlsbD0iIzFkMWQxZCIgc3Ryb2tlPSIjMWQxZDFkIiBzdHJva2Utd2lkdGg9IjIiIHBvaW50ZXItZXZlbnRzPSJub25lIi8+PC9nPjxnIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJDYXZlYXQgQnJ1c2giIHRleHQtYWxpZ249ImxlZnQiIGZpbGw9IiMxZDFkMWQiIHRyYW5zZm9ybS1vcmlnaW49InRvcCBsZWZ0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOSwgMTUuNSkiPjx0ZXh0IHk9IjE4LjIiLz48L2c+PC9nPjwvc3ZnPg==',
      size: [106, 265],
    },
  ],
}

const myDocument: TDDocument = {
  id: 'doc',
  version: TldrawApp.version,
  pages: {
    page1: {
      id: 'page1',
      shapes: {},
      bindings: {},
    },
  },
  pageStates: {
    page1: {
      id: 'page1',
      selectedIds: [],
      currentParentId: 'page1',
      camera: {
        point: [0, 0],
        zoom: 1,
      },
    },
  },
  assets: {},
}

function Component({ resolveApi, tdDocument }) {
  const rTldrawApp = React.useRef<TldrawApp>()

  const handleMount = React.useCallback((app: TldrawApp) => {
    rTldrawApp.current = app

    resolveApi(app)
  }, [])

  return React.createElement(
    Tldraw,
    {
      document: myDocument,
      onMount: handleMount,
      onSaveProjectAs: console.log,
      showMenu: false,
      showPages: false,
    },
    null
  )
}

class TldrawView {
  private renderTLDrawToElement(
    tdDocument: TDDocument,
    element: HTMLElement
  ): Promise<TldrawApp> {
    let resolveApi: (api: TldrawApp) => void

    const api = new Promise<TldrawApp>((res) => {
      resolveApi = (api) => res(api)
    })
    ReactDOM.render(
      React.createElement(
        Component,
        { resolveApi, tdDocument, currentPageId: 'page1' },
        null
      ),
      element
    )

    return api
  }

  private mountPoint: HTMLElement
  private api: Promise<TldrawApp>
  async create(mountPoint: HTMLElement) {
    this.destroy()
    this.mountPoint = mountPoint
    mountPoint.addEventListener('mouseup', (e) => e.stopPropagation())
    mountPoint.addEventListener('mousedown', (e) => e.stopPropagation())
    mountPoint.addEventListener('keydown', (e) => e.stopPropagation())
    mountPoint.addEventListener('keypress', (e) => e.stopPropagation())

    const src = mountPoint.querySelector('img').getAttribute('src')
    const d = openDocument(src)
    // console.log(src, d)
    this.api = this.renderTLDrawToElement(d, mountPoint)
    const api = await this.api
    if (prefersDarkMode) api.toggleDarkMode()

    api.addMediaFromFile(dataURLtoFile(src, 'input.svg'))

    window.api = api
  }

  async destroy() {
    if (this.api) {
      const api = await this.api

      const svg = await api.copySvg()
      const doc = api.document
      console.log({ svg, doc })
    }

    if (this.mountPoint) ReactDOM.unmountComponentAtNode(this.mountPoint)
    this.mountPoint = null
  }
}

export const tldrawEditor = new TldrawView()

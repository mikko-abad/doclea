import { createDocument } from './createDocument'

const prefix = 'data:image/svg+xml;base64,'

const tldrawDataAttribute = /data-tldraw=(?:'([^']+)'|"([^"]+)"|([^"' ])+)/

export const openDocument = (dataURI: string) => {
  if (!dataURI.startsWith(prefix))
    throw new Error(`data uri has wrong prefix: ${dataURI}`)

  const d = dataURI.replace(prefix, '')

  const svg = atob(d)
  console.log(svg)

  const match = tldrawDataAttribute.exec(svg)
  if (!match) return null
  const doc = [...match].slice(1).find((text) => text)

  // console.log(document)
  if (match) return JSON.parse(atob(doc))

  // return createDocument(dataURI)
}

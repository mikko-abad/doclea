import { createDocument } from './createDocument'

const prefix = 'data:image/svg+xml;base64,'

const tldrawDataAttribute = /data-tldraw=(?:'([^']+)'|"([^"]+)"|([^"' ])+)/

export const openDocument = (dataURI: string) => {
  if (!dataURI.startsWith(prefix))
    throw new Error(`data uri has wrong prefix: ${dataURI}`)

  const d = dataURI.replace(prefix, '')

  const svg = atob(d)
  // console.log({ svg })

  const document = tldrawDataAttribute.exec(svg)?.[1]

  // console.log(document)
  if (document) return JSON.parse(btoa(document))

  return createDocument(dataURI)
}

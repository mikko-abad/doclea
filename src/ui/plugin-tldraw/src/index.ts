/* Copyright 2021, Milkdown by Mirone. */

import { AtomList } from '@milkdown/utils'

import { tldrawNode } from './node'

export * from './remark-mermaid'

export const tldraw = AtomList.create([tldrawNode()])

export type { Options } from './node'
export { TurnIntoDiagram } from './node'

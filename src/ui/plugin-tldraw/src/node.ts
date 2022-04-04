/* Copyright 2021, Milkdown by Mirone. */
import { createCmd, createCmdKey } from '@milkdown/core'
import { setBlockType, textblockTypeInputRule } from '@milkdown/prose'
import { createNode } from '@milkdown/utils'
import { tldrawEditor } from '../../tldraw/editor'

import { remarkMermaid } from './remark-mermaid'
import { createInnerEditor } from './inner-editor'
import { getId } from './utility'

const inputRegex = /^```mermaid$/

export type Options = {
  placeholder: {
    empty: string
    error: string
  }
}

export const TurnIntoDiagram = createCmdKey('TurnIntoDiagram')

export const tldrawNode = createNode<string, Options>((utils, options) => {
  const id = 'tldraw'

  return {
    id,
    schema: () => ({
      content: 'text*',
      group: 'inline',
      inline: true,
      marks: '',
      defining: true,
      atom: true,
      isolating: true,
      attrs: {
        value: {
          default: '',
        },
        identity: {
          default: '',
        },
      },
      parseDOM: [
        {
          tag: `img[data-type="${id}"]`,
          preserveWhitespace: 'full',
          getAttrs: (dom) => {
            if (!(dom instanceof HTMLElement)) {
              throw new Error()
            }
            return {
              value: dom.dataset['url'],
              identity: dom.id,
            }
          },
        },
      ],
      toDOM: (node) => {
        const identity = getId(node)
        return [
          'img',
          {
            id: identity,
            class: utils.getClassName(node.attrs, 'tldraw'),
            'data-type': id,
            url: node.attrs['value'],
          },
          0,
        ]
      },
      parseMarkdown: {
        match: ({ type }) => type === id,
        runner: (state, node, type) => {
          const value = node['value'] as string
          state.openNode(type, { value })
          if (value) {
            state.addText(value)
          }
          state.closeNode()
        },
      },
      toMarkdown: {
        match: (node) => node.type.name === id,
        runner: (state, node) => {
          state.addNode('image', undefined, '', { url: node.value })
        },
      },
    }),
    commands: (nodeType) => [
      createCmd(TurnIntoDiagram, () => setBlockType(nodeType, { id: getId() })),
    ],
    view: () => (node, view, getPos) => {
      const innerEditor = createInnerEditor(view, getPos)

      const currentId = getId(node)
      let currentNode = node
      const dom = document.createElement('div')
      dom.classList.add('tldraw')

      const rendered = document.createElement('div')
      rendered.id = currentId

      // render(node.attrs['value'])

      rendered.innerHTML = `<img src="${node.attrs['value']}">`

      //const api = renderTLDrawToElement(dom)
      dom.appendChild(rendered)
      console.log(rendered)
      rendered.classList.add('rendered')

      const stopPropagation = (e) => e.stopPropagation()

      return {
        dom,
        update: (updatedNode) => {
          if (!updatedNode.sameMarkup(currentNode)) return false
          currentNode = updatedNode

          const newVal = updatedNode.content.firstChild?.text || ''
          console.log({ newVal })

          //render(newVal)

          return true
        },
        selectNode: () => {
          if (!view.editable) return

          innerEditor.openEditor(rendered, currentNode)
          tldrawEditor.create(rendered)

          //dom.classList.add('ProseMirror-selectednode')
        },
        deselectNode: () => {
          console.log('deselect')
          innerEditor.closeEditor()
          tldrawEditor.destroy()
          dom.classList.remove('ProseMirror-selectednode')
        },
        stopEvent: (event) => {
          const innerView = innerEditor.innerView()
          const { target } = event
          const isChild = target && innerView?.dom.contains(target as Element)

          console.log(innerView, isChild, !!(innerView && isChild))
          return !!(innerView && isChild)
        },
        ignoreMutation: () => true,
        destroy() {
          rendered.remove()

          dom.remove()
        },
      }
    },
    inputRules: (nodeType) => {
      console.log(nodeType)
      return [
        textblockTypeInputRule(inputRegex, nodeType, () => ({ id: getId() })),
      ]
    },
    remarkPlugins: () => [remarkMermaid],
  }
})
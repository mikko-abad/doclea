/* Copyright 2021, Milkdown by Mirone. */
import { createCmd, createCmdKey } from '@milkdown/core'
import { setBlockType, textblockTypeInputRule } from '@milkdown/prose'
import { createNode } from '@milkdown/utils'
import mermaid from 'mermaid'
import { tldrawEditor } from '../../tldraw/editor'

import { remarkMermaid } from '.'
import { createInnerEditor } from './inner-editor'
import { getStyle } from './style'
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
  const { mermaidVariables, codeStyle, hideCodeStyle, previewPanelStyle } =
    getStyle(utils)

  const id = 'tldraw'

  const placeholder = {
    empty: 'Empty',
    error: 'Syntax Error',
    ...(options?.placeholder ?? {}),
  }

  return {
    id,
    schema: () => ({
      content: 'text*',
      group: 'inline',
      inline: true,
      marks: '',
      defining: true,
      atom: true,

      //  code: true,
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
      const code = document.createElement('div')
      code.dataset['type'] = id
      code.dataset['value'] = node.attrs['value']
      if (codeStyle && hideCodeStyle) {
        code.classList.add(codeStyle, hideCodeStyle)
      }

      const rendered = document.createElement('div')
      rendered.id = currentId
      if (previewPanelStyle) {
        rendered.classList.add(previewPanelStyle)
      }

      dom.append(code)

      const render = (code: string) => {
        try {
          if (!code) {
            rendered.innerHTML = placeholder.empty
          } else {
            //const svg = mermaid.render(currentId, header + code)
            //rendered.innerHTML = svg
          }
        } catch {
          const error = document.getElementById('d' + currentId)
          if (error) {
            error.remove()
          }
          rendered.innerHTML = placeholder.error
        } finally {
          dom.appendChild(rendered)
        }
      }

      // render(node.attrs['value'])

      rendered.innerHTML = `<img src="${node.attrs['value']}">`

      //const api = renderTLDrawToElement(dom)
      dom.appendChild(rendered)
      console.log(rendered)
      rendered.classList.add('rendered')

      const stopPropagation = (e) => e.stopPropagation()

      rendered.addEventListener('click', stopPropagation)

      //rendered.addEventListener('mousedown', stopPropagation)
      //

      return {
        dom,
        update: (updatedNode) => {
          if (!updatedNode.sameMarkup(currentNode)) return false
          currentNode = updatedNode

          //   const innerView = innerEditor.innerView()
          //   if (innerView) {
          //     const state = innerView.state
          //     const start = updatedNode.content.findDiffStart(state.doc.content)
          //     if (start !== null && start !== undefined) {
          //       const diff = updatedNode.content.findDiffEnd(state.doc.content)
          //       if (diff) {
          //         let { a: endA, b: endB } = diff
          //         const overlap = start - Math.min(endA, endB)
          //         if (overlap > 0) {
          //           endA += overlap
          //           endB += overlap
          //         }
          //         innerView.dispatch(
          //           state.tr
          //             .replace(start, endB, node.slice(start, endA))
          //             .setMeta('fromOutside', true)
          //         )
          //       }
          //     }
          //   }

          const newVal = updatedNode.content.firstChild?.text || ''
          console.log({ newVal })
          code.dataset['value'] = newVal

          //render(newVal)

          return true
        },
        selectNode: () => {
          if (!view.editable) return
          if (hideCodeStyle) {
            code.classList.remove(hideCodeStyle)
          }
          innerEditor.openEditor(rendered, currentNode)
          tldrawEditor.create(rendered)

          //dom.classList.add('ProseMirror-selectednode')
        },
        deselectNode: () => {
          if (hideCodeStyle) {
            code.classList.add(hideCodeStyle)
          }
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
          code.remove()
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

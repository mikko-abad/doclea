import { EditorState, EditorView, Node } from '@milkdown/prose'

export const createInnerEditor = (
  outerView: EditorView,
  getPos: () => number
) => {
  let isEditing = false
  let innerView: EditorView | undefined

  const openEditor = ($: HTMLElement, doc: Node) => {
    const st = EditorState.create({ doc })

    innerView = new EditorView($, {
      state: EditorState.create({
        doc,
        plugins: [],
      }),
      dispatchTransaction: (tr) => {},
    })

    innerView.focus()

    const { state } = innerView

    // innerView.dispatch(
    //   state.tr.setSelection(TextSelection.create(state.doc, 0))
    // )
    isEditing = true
  }

  const closeEditor = () => {
    if (innerView) {
      innerView.destroy()
    }
    innerView = undefined
    isEditing = false
  }

  return {
    isEditing: () => isEditing,
    innerView: () => innerView,
    openEditor,
    closeEditor,
  }
}

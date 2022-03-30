var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { createNode, AtomList } from "@milkdown/utils";
import { createCmdKey, createCmd } from "@milkdown/core";
import { EditorView, EditorState, keymap, newlineInCode, TextSelection, StepMap, setBlockType, textblockTypeInputRule } from "@milkdown/prose";
import mermaid from "mermaid";
import { visit } from "unist-util-visit";
import { customAlphabet } from "nanoid";
const createInnerEditor = (outerView, getPos) => {
  let isEditing = false;
  let innerView;
  const openEditor = ($, doc) => {
    innerView = new EditorView($, {
      state: EditorState.create({
        doc,
        plugins: [
          keymap({
            Tab: (state2, dispatch) => {
              if (dispatch) {
                dispatch(state2.tr.insertText("	"));
              }
              return true;
            },
            Enter: newlineInCode,
            "Mod-Enter": (_, dispatch) => {
              if (dispatch) {
                const { state: state2 } = outerView;
                const { to } = state2.selection;
                const tr = state2.tr.replaceWith(to, to, state2.schema.nodes.paragraph.createAndFill());
                outerView.dispatch(tr.setSelection(TextSelection.create(tr.doc, to)));
                outerView.focus();
              }
              return true;
            }
          })
        ]
      }),
      dispatchTransaction: (tr) => {
        if (!innerView)
          return;
        const { state: state2, transactions } = innerView.state.applyTransaction(tr);
        innerView.updateState(state2);
        if (!tr.getMeta("fromOutside")) {
          const outerTr = outerView.state.tr;
          const offsetMap = StepMap.offset(getPos() + 1);
          transactions.forEach((transaction) => {
            const { steps } = transaction;
            steps.forEach((step) => {
              const mapped = step.map(offsetMap);
              if (!mapped) {
                throw Error("step discarded!");
              }
              outerTr.step(mapped);
            });
          });
          if (outerTr.docChanged)
            outerView.dispatch(outerTr);
        }
      }
    });
    innerView.focus();
    const { state } = innerView;
    innerView.dispatch(state.tr.setSelection(TextSelection.create(state.doc, 0)));
    isEditing = true;
  };
  const closeEditor = () => {
    if (innerView) {
      innerView.destroy();
    }
    innerView = void 0;
    isEditing = false;
  };
  return {
    isEditing: () => isEditing,
    innerView: () => innerView,
    openEditor,
    closeEditor
  };
};
const nanoid = customAlphabet("abcedfghicklmn", 10);
function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function tryRgbToHex(maybeRgb) {
  if (!maybeRgb)
    return "";
  const result = maybeRgb.split(",").map((x) => Number(x.trim()));
  if (result.length < 3) {
    return maybeRgb;
  }
  const valid = result.every((x) => {
    return x >= 0 && x <= 256;
  });
  if (!valid) {
    return maybeRgb;
  }
  return rgbToHex(...result);
}
const getId = (node) => {
  var _a;
  return ((_a = node == null ? void 0 : node.attrs) == null ? void 0 : _a["identity"]) || nanoid();
};
const getStyle = (utils) => {
  const codeStyle = utils.getStyle(({ palette, size, font }, { css }) => css`
            color: ${palette("neutral", 0.87)};
            background-color: ${palette("background")};
            border-radius: ${size.radius};
            padding: 1rem 2rem;
            font-size: 0.875rem;
            font-family: ${font.code};
            overflow: hidden;
            .ProseMirror {
                outline: none;
            }
        `);
  const hideCodeStyle = utils.getStyle((_, { css }) => css`
            display: none;
        `);
  const previewPanelStyle = utils.getStyle((_, { css }) => css`
            display: flex;
            justify-content: center;
            padding: 1rem 0;
        `);
  const mermaidVariables = () => {
    const styleRoot = getComputedStyle(document.documentElement);
    const getColor = (v) => tryRgbToHex(styleRoot.getPropertyValue("--" + v));
    const line = getColor("line");
    const solid = getColor("solid");
    const neutral = getColor("neutral");
    const background = getColor("background");
    const style = {
      background,
      primaryColor: background,
      secondaryColor: line,
      primaryTextColor: neutral,
      noteBkgColor: background,
      noteTextColor: solid
    };
    return Object.entries(style).filter(([_, value]) => value.length > 0).map(([key, value]) => `'${key}':'${value}'`).join(", ");
  };
  return {
    codeStyle,
    hideCodeStyle,
    previewPanelStyle,
    mermaidVariables
  };
};
const inputRegex = /^```mermaid$/;
const TurnIntoDiagram = createCmdKey("TurnIntoDiagram");
const diagramNode = createNode((utils, options) => {
  var _a;
  const { mermaidVariables, codeStyle, hideCodeStyle, previewPanelStyle } = getStyle(utils);
  const header = `%%{init: {'theme': 'base', 'themeVariables': { ${mermaidVariables()} }}}%%
`;
  const id = "diagram";
  mermaid.startOnLoad = false;
  mermaid.initialize({ startOnLoad: false });
  const placeholder = __spreadValues({
    empty: "Empty",
    error: "Syntax Error"
  }, (_a = options == null ? void 0 : options.placeholder) != null ? _a : {});
  return {
    id,
    schema: () => ({
      content: "text*",
      group: "block",
      marks: "",
      defining: true,
      atom: true,
      code: true,
      isolating: true,
      attrs: {
        value: {
          default: ""
        },
        identity: {
          default: ""
        }
      },
      parseDOM: [
        {
          tag: `div[data-type="${id}"]`,
          preserveWhitespace: "full",
          getAttrs: (dom) => {
            if (!(dom instanceof HTMLElement)) {
              throw new Error();
            }
            return {
              value: dom.dataset["value"],
              identity: dom.id
            };
          }
        }
      ],
      toDOM: (node) => {
        const identity = getId(node);
        return [
          "div",
          {
            id: identity,
            class: utils.getClassName(node.attrs, "mermaid"),
            "data-type": id,
            "data-value": node.attrs["value"]
          },
          0
        ];
      },
      parseMarkdown: {
        match: ({ type }) => type === id,
        runner: (state, node, type) => {
          const value = node["value"];
          state.openNode(type, { value });
          if (value) {
            state.addText(value);
          }
          state.closeNode();
        }
      },
      toMarkdown: {
        match: (node) => node.type.name === id,
        runner: (state, node) => {
          var _a2;
          state.addNode("code", void 0, ((_a2 = node.content.firstChild) == null ? void 0 : _a2.text) || "", { lang: "mermaid" });
        }
      }
    }),
    commands: (nodeType) => [createCmd(TurnIntoDiagram, () => setBlockType(nodeType, { id: getId() }))],
    view: () => (node, view, getPos) => {
      const innerEditor = createInnerEditor(view, getPos);
      const currentId = getId(node);
      let currentNode = node;
      const dom = document.createElement("div");
      dom.classList.add("mermaid", "diagram");
      const code = document.createElement("div");
      code.dataset["type"] = id;
      code.dataset["value"] = node.attrs["value"];
      if (codeStyle && hideCodeStyle) {
        code.classList.add(codeStyle, hideCodeStyle);
      }
      const rendered = document.createElement("div");
      rendered.id = currentId;
      if (previewPanelStyle) {
        rendered.classList.add(previewPanelStyle);
      }
      dom.append(code);
      const render = (code2) => {
        try {
          if (!code2) {
            rendered.innerHTML = placeholder.empty;
          } else {
            const svg = mermaid.render(currentId, header + code2);
            rendered.innerHTML = svg;
          }
        } catch {
          const error = document.getElementById("d" + currentId);
          if (error) {
            error.remove();
          }
          rendered.innerHTML = placeholder.error;
        } finally {
          dom.appendChild(rendered);
        }
      };
      render(node.attrs["value"]);
      return {
        dom,
        update: (updatedNode) => {
          var _a2;
          if (!updatedNode.sameMarkup(currentNode))
            return false;
          currentNode = updatedNode;
          const innerView = innerEditor.innerView();
          if (innerView) {
            const state = innerView.state;
            const start = updatedNode.content.findDiffStart(state.doc.content);
            if (start !== null && start !== void 0) {
              const diff = updatedNode.content.findDiffEnd(state.doc.content);
              if (diff) {
                let { a: endA, b: endB } = diff;
                const overlap = start - Math.min(endA, endB);
                if (overlap > 0) {
                  endA += overlap;
                  endB += overlap;
                }
                innerView.dispatch(state.tr.replace(start, endB, node.slice(start, endA)).setMeta("fromOutside", true));
              }
            }
          }
          const newVal = ((_a2 = updatedNode.content.firstChild) == null ? void 0 : _a2.text) || "";
          code.dataset["value"] = newVal;
          render(newVal);
          return true;
        },
        selectNode: () => {
          if (!view.editable)
            return;
          if (hideCodeStyle) {
            code.classList.remove(hideCodeStyle);
          }
          innerEditor.openEditor(code, currentNode);
          dom.classList.add("ProseMirror-selectednode");
        },
        deselectNode: () => {
          if (hideCodeStyle) {
            code.classList.add(hideCodeStyle);
          }
          innerEditor.closeEditor();
          dom.classList.remove("ProseMirror-selectednode");
        },
        stopEvent: (event) => {
          const innerView = innerEditor.innerView();
          const { target } = event;
          const isChild = target && (innerView == null ? void 0 : innerView.dom.contains(target));
          return !!(innerView && isChild);
        },
        ignoreMutation: () => true,
        destroy() {
          rendered.remove();
          code.remove();
          dom.remove();
        }
      };
    },
    inputRules: (nodeType) => [textblockTypeInputRule(inputRegex, nodeType, () => ({ id: getId() }))],
    remarkPlugins: () => [remarkMermaid]
  };
});
const createMermaidDiv = (contents) => ({
  type: "diagram",
  value: contents
});
const visitCodeBlock = (ast) => visit(ast, "code", (node, index, parent) => {
  const { lang, value } = node;
  if (lang !== "mermaid") {
    return node;
  }
  const newNode = createMermaidDiv(value);
  if (parent && index != null) {
    parent.children.splice(index, 1, newNode);
  }
  return node;
});
const remarkMermaid = () => {
  function transformer(tree) {
    visitCodeBlock(tree);
  }
  return transformer;
};
const diagram = AtomList.create([diagramNode()]);
export { TurnIntoDiagram, diagram, remarkMermaid };
//# sourceMappingURL=index.es.js.map

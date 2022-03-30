export declare type Options = {
    placeholder: {
        empty: string;
        error: string;
    };
};
export declare const TurnIntoDiagram: import("@milkdown/core").CmdKey<undefined>;
export declare const diagramNode: import("@milkdown/utils/lib/src/types").WithExtend<string, Options, import("prosemirror-model").NodeType<any>, {
    id: string;
    schema: (ctx: import("@milkdown/core").Ctx) => import("@milkdown/core").NodeSchema;
    view?: ((ctx: import("@milkdown/core").Ctx) => import("@milkdown/prose").NodeViewFactory) | undefined;
}>;
//# sourceMappingURL=node.d.ts.map
export type LayoutMode = "row" | "column";

export function isLayoutMode(json: any): json is LayoutMode {
    return json === "row" || json === "column"
}

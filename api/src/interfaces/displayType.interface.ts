export type DisplayType = "website" | "logs";

export function isDisplayType(json: any): json is DisplayType {
    return json === "website" || json === "logs"
}

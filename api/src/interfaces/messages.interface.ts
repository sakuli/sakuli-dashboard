export type Messages = {
    description: string
    infoText: string
}

export function isMessages(json: any): json is Messages {
    if (!json) {
        return false;
    }

    return Object.keys(json).length === 2 &&
        typeof json.description === "string" &&
        typeof json.infoText === "string"
}
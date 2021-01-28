export interface DisplayUpdate {
    url?: string
    pollingInterval?: number
}

export function isDisplayUpdate(json: any): json is DisplayUpdate {
    if (!json) {
        return false;
    }

    if (Object.keys(json).length === 0 && typeof json === "object") {
        return true;
    }

    if (Object.keys(json).length === 1) {
        return typeof json.url === "string" || typeof json.pollingInterval === "number";
    }

    if (Object.keys(json).length === 2) {
        return typeof json.url === "string" && typeof json.pollingInterval === "number";
    }

    return false;
}
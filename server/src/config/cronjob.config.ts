export interface CronjobConfig{
    schedule: string,
    actionIdentifier: string
}

export function isCronjobConfig(json: any): json is CronjobConfig {
    if (!json) {
        return false;
    }

    return Object.keys(json).length === 2 &&
        typeof json.schedule === "string" &&
        typeof json.actionIdentifier === "string";
}
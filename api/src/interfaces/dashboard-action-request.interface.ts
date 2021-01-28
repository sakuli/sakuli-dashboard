export interface DashboardActionRequest {
    actionIdentifier: string
}

export function isDashboardActionRequest(json: any): json is DashboardActionRequest {
    if (!json) {
        return false;
    }

    return Object.keys(json).length === 1 &&
        typeof json.actionIdentifier === "string";
}
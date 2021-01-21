import { DashboardConfigResponse, isLayoutMode, validateDisplays } from "@sakuli-dashboard/api";

export interface DashboardConfig extends DashboardConfigResponse {
}

export function isDashboardConfig(json: any): json is DashboardConfig {
    if (!json) {
        return false;
    }

    if (Object.keys(json).length === 1) {
        return validateDisplays(json.displays);
    }

    if (Object.keys(json).length === 2) {
        return validateDisplays(json.displays) && isLayoutMode(json.defaultLayout);
    }

    return false;
}
import { DashboardActionRequest } from "@sakuli-dashboard/api";

export interface CronjobConfig extends DashboardActionRequest {
    schedule: string
}

export function isCronjobConfig(json: any): json is CronjobConfig {
    function containsTwoFields() {
        return Object.keys(json).length === 2 && json.constructor === Object;
    }

    return !!(containsTwoFields() && (json as CronjobConfig).schedule && (json as CronjobConfig).actionIdentifier);
}
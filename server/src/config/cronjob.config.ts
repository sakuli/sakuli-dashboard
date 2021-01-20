import { DashboardActionRequest } from "@sakuli-dashboard/api";

export interface CronjobConfig extends DashboardActionRequest {
    schedule: string
}

export function isCronjobConfig(json: any): json is CronjobConfig {
    function containsTwoFields() {
        return Object.keys(json).length === 2 && json.constructor === Object;
    }

    function containsCronjobConfigFields() {
        return !!(
          (json as CronjobConfig).schedule &&
          (json as CronjobConfig).actionIdentifier
        )
    }

    return containsTwoFields() && containsCronjobConfigFields();
}
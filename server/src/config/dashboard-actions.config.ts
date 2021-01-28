import { V1Pod } from "@kubernetes/client-node";
import { DisplayUpdate, isDisplayUpdate } from '@sakuli-dashboard/api';

export interface DashboardActionsConfig{
    actions: ClusterAction[]
}

export interface ClusterAction {
    actionIdentifier: string
    action: V1Pod
    displayUpdate?: DisplayUpdate
}

export function isDashboardActionsConfig(json: any): json is DashboardActionsConfig {
    if (!json) {
        return false;
    }

    if (Object.keys(json).length === 1 && Array.isArray(json.actions)) {
        for (let action of json.actions) {
            if (!isClusterAction(action)) {
                return false;
            }
        }
        return true;
    }

    return false;
}

export function isClusterAction(json: any): json is ClusterAction {
    if (!json) {
        return false;
    }

    if (Object.keys(json).length === 2) {
        return typeof json.actionIdentifier === "string" &&
            typeof json.action === "object"
    }

    if (Object.keys(json).length === 3) {
        return typeof json.actionIdentifier === "string" &&
            typeof json.action === "object" &&
            isDisplayUpdate(json.displayUpdate);
    }

    return false;
}
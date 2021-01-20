import { V1Pod } from "@kubernetes/client-node";
import { DisplayUpdate } from '@sakuli-dashboard/api';

export interface DashboardActionsConfig{
    actions: ClusterAction[]
}

export interface ClusterAction {
    actionIdentifier: string
    action: V1Pod
    displayUpdate?: DisplayUpdate
}

export function isDashboardActionsConfig(json: any): json is DashboardActionsConfig {
    function containsOneField() {
        return Object.keys(json).length === 1 && json.constructor === Object;
    }

    function containsDashboardActionsConfigField() {
        return !!((json as DashboardActionsConfig).actions);
    }

    return containsOneField() && containsDashboardActionsConfigField();
}

export function isClusterAction(json: any): json is ClusterAction {
    function containsFieldCount(n: number) {
        return Object.keys(json).length === n && json.constructor === Object;
    }

    function containsMandatoryFields() {
        return !!((json as ClusterAction).actionIdentifier && (json as ClusterAction).action);
    }

    function containsOnlyMandatoryClusterActionFields() {
        return containsFieldCount(2) && containsMandatoryFields();
    }

    function containsAllClusterActionFields() {
        return !!(containsFieldCount(3) && containsMandatoryFields() && (json as ClusterAction).displayUpdate);
    }

    return containsOnlyMandatoryClusterActionFields() || containsAllClusterActionFields();
}
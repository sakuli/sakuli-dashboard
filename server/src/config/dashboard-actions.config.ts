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

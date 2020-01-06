import { V1Pod } from "@kubernetes/client-node";

export interface DashboardActionsConfig{
    actions: ClusterAction[]
}

export interface ClusterAction {
    actionIdentifier: string
    action: V1Pod
    displayUpdate?: DisplayUpdate
}

export interface DisplayUpdate{
    url?: string
    reloadDelay?: number
}

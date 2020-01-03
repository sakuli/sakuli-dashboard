export interface DashboardActionsConfig{
    actions: ClusterAction[]
}

export interface ClusterAction {
    actionIdentifier: string
    action: string //Kubernetes YAML to execute
    displayUpdate?: DisplayUpdate
}

export interface DisplayUpdate{
    url?: string
    reloadDelay?: number
}

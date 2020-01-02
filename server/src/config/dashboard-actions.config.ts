export interface DashboardActionsConfig{
    actions: ClusterAction[]
}

export interface ClusterAction {
    actionIdentifier: string
    action: string //Kubernetes YAML to execute
}

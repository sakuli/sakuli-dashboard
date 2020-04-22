import { K8sClusterConfig } from "../config/k8s-cluster.config";
import { DashboardConfig } from "../config/dashboard.config";
import { DashboardActionsConfig } from "../config/dashboard-actions.config";
import createBackendError from "./create-backend-error.function";
import { CronjobConfig } from "../config/cronjob.config";

type ConfigTypes = DashboardActionsConfig | K8sClusterConfig | DashboardConfig | CronjobConfig;
let configuration: Configuration;

export interface Configuration {
    dashboardConfig: DashboardConfig,
    k8sClusterConfig: K8sClusterConfig,
    actionConfig: DashboardActionsConfig,
    cronjobConfig: CronjobConfig
}
export function getConfiguration(){
    if(!configuration){
        configuration = {
            dashboardConfig: getConfig<DashboardConfig>(process.env.DASHBOARD_CONFIG, "DASHBOARD_CONFIG"),
            k8sClusterConfig: getConfig<K8sClusterConfig>(process.env.CLUSTER_CONFIG, "CLUSTER_CONFIG"),
            actionConfig: getConfig<DashboardActionsConfig>(process.env.ACTION_CONFIG, "ACTION_CONFIG"),
            cronjobConfig: getConfig<CronjobConfig>(process.env.CRONJOB_CONFIG, "CRONJOB_CONFIG")
        }
    }
    return configuration;
}

function createInvalidConfigError(message: string) {
    return createBackendError(`Invalid configuration: ${message}`);
}

function getConfig<T extends ConfigTypes>(environmentVariable: string | undefined, variableName: string): T {
    if(!environmentVariable) {
        throw createInvalidConfigError(`Environment ${variableName} is empty or undefined.`);
    }

    try {
        return <T>JSON.parse(environmentVariable);
    } catch (e) {
        throw createInvalidConfigError(`Could not parse environment variable ${variableName}.`);
    }
}
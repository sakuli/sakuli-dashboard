import { K8sClusterConfig } from "../config/k8s-cluster.config";
import { DashboardConfig } from "../config/dashboard.config";
import { DashboardActionsConfig } from "../config/dashboard-actions.config";
import createBackendError from "./create-backend-error.function";
import { CronjobConfig } from "../config/cronjob.config";

type ConfigTypes = DashboardActionsConfig | K8sClusterConfig | DashboardConfig | CronjobConfig;
let configuration: Configuration;

export interface Configuration {
    dashboardConfig: DashboardConfig,
    k8sClusterConfig?: K8sClusterConfig,
    actionConfig?: DashboardActionsConfig,
    cronjobConfig?: CronjobConfig
}
export function getConfiguration(){
    if(!configuration){
        configuration = {
            dashboardConfig: getMandatoryConfig<DashboardConfig>(process.env.DASHBOARD_CONFIG, "DASHBOARD_CONFIG"),
            k8sClusterConfig: getOptionalConfig<K8sClusterConfig>(process.env.CLUSTER_CONFIG, "CLUSTER_CONFIG"),
            actionConfig: getOptionalConfig<DashboardActionsConfig>(process.env.ACTION_CONFIG, "ACTION_CONFIG"),
            cronjobConfig: getOptionalConfig<CronjobConfig>(process.env.CRONJOB_CONFIG, "CRONJOB_CONFIG")
        }
    }
    return configuration;
}

function createInvalidConfigError(message: string) {
    return createBackendError(`Invalid configuration: ${message}`);
}

function getMandatoryConfig<T extends ConfigTypes>(environmentVariable: string | undefined, variableName: string): T {
    if(!environmentVariable) {
        throw createInvalidConfigError(`Environment ${variableName} is empty or undefined.`);
    }

    return parseEnvironmentVariable(environmentVariable, variableName);
}

function getOptionalConfig<T extends ConfigTypes>(environmentVariable: string | undefined, variableName: string): T | undefined {
    if(!environmentVariable) {
        return undefined;
    }

    return parseEnvironmentVariable<T>(environmentVariable, variableName);
}

function parseEnvironmentVariable<T extends ConfigTypes>(environmentVariable: string, variableName: string): T {
    try {
        return <T>JSON.parse(environmentVariable);
    } catch (e) {
        throw createInvalidConfigError(`Could not parse environment variable ${variableName}.`);
    }
}
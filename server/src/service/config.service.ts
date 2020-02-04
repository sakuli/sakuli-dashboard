import { K8sClusterConfig } from "../config/k8s-cluster.config";
import { DashboardConfig } from "../config/dashboard.config";
import { DashboardActionsConfig } from "../config/dashboard-actions.config";
import createBackendError from "../functions/create-backend-error.function";

export type ConfigMap = Map<string, (DashboardActionsConfig | K8sClusterConfig | DashboardConfig)>

const defaultConfigCacheMap: ConfigMap = new Map();

function createInvalidConfigError(message: string) {
    return createBackendError(`Invalid configuration: ${message}`);
}

export default function getConfig<T>(environmentVariable: string | undefined,
                                     configMap: ConfigMap = defaultConfigCacheMap): T {
    if(!environmentVariable) {
        throw createInvalidConfigError("Environment variable is undefined");
    }

    if(!configMap.get(environmentVariable)) {
        try {
            configMap.set(environmentVariable, <T>JSON.parse(environmentVariable));
        } catch (e) {
            throw createInvalidConfigError("Could not parse environment variable");
        }
    }
    return <T>configMap.get(environmentVariable);
}
import { Cluster, User } from "@kubernetes/client-node/dist/config_types";

export interface K8sClusterConfig{
    cluster: Cluster,
    user: User,
    namespace: string,
}

export function isK8sClusterConfig(json: any): json is K8sClusterConfig {
    if (!json) {
        return false;
    }

    return Object.keys(json).length === 3 &&
        typeof json.cluster === "object" &&
        typeof json.user === "object" &&
        typeof json.namespace === "string";
}
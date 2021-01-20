import { Cluster, User } from "@kubernetes/client-node/dist/config_types";

export interface K8sClusterConfig{
    cluster: Cluster,
    user: User,
    namespace: string,
}

export function isK8sClusterConfig(json: any): json is K8sClusterConfig {
    function containsThreeFields() {
        return Object.keys(json).length === 3 && json.constructor === Object;
    }

    function containsK8sClusterConfigFields() {
        return !!(
          (json as K8sClusterConfig).cluster &&
          (json as K8sClusterConfig).user &&
          (json as K8sClusterConfig).namespace
        )
    }

    return containsThreeFields() && containsK8sClusterConfigFields()
}
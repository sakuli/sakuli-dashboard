import { Cluster, User } from "@kubernetes/client-node/dist/config_types";

export interface K8sClusterConfig{
    cluster: Cluster,
    user: User,
    namespace: string,
}
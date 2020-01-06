import { CoreV1Api, KubeConfig, V1Status } from "@kubernetes/client-node";
import { K8sClusterConfig } from "../config/k8s-cluster.config";
import isEmpty from "../functions/is-emtpy.function";
import { ClusterAction } from "../config/dashboard-actions.config";
import * as http from "http";
const k8s = require('@kubernetes/client-node');

const clusterConfig = <K8sClusterConfig>JSON.parse(process.env.CLUSTER_CONFIG || "{}");
export interface K8sService {
    apply: (clusterAction: ClusterAction) => Promise<http.IncomingMessage>
}

export function k8sService(): K8sService{
    function createK8sClient (): Promise<CoreV1Api> {

        return new Promise((resolve, reject) => {
            if (isEmpty(clusterConfig)) {
                reject("Environment variable 'CLUSTER_CONFIG' not set or empty.");
            }

            const k8sCubeConfig = new k8s.KubeConfig();
            k8sCubeConfig.loadFromOptions({
                clusters: [clusterConfig.cluster],
                users: [clusterConfig.user],
                contexts: {
                    cluster: clusterConfig.cluster.name,
                    user: clusterConfig.user.name,
                    name: "myContext"
                },
                currentContext: "myContext"
            });

            resolve(k8sCubeConfig.makeApiClient(k8s.CoreV1Api));
        });

    }

    function apply(clusterAction: ClusterAction): Promise<http.IncomingMessage>{
        return new Promise((resolve, reject) => {
            createK8sClient()
                .then(k8sApi => {
                    return k8sApi.createNamespacedPod(
                        clusterConfig.namespace,
                        clusterAction.action)})
                .then(({response}) => resolve(response))
                .catch(error => reject(`Could not apply action because of: ${error}.`));
        });
    }

    return ({apply})
}


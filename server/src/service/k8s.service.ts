import { CoreV1Api, V1Pod } from "@kubernetes/client-node";
import { K8sClusterConfig } from "../config/k8s-cluster.config";
import isEmpty from "../functions/is-emtpy.function";
import * as http from "http";


const k8s = require('@kubernetes/client-node');

const clusterConfig = <K8sClusterConfig>JSON.parse(process.env.CLUSTER_CONFIG || "{}");
export interface K8sService {
    apply: (pod: V1Pod) => Promise<http.IncomingMessage>
    getPodStatus: (pod: V1Pod) => Promise<V1Pod>
    deletePod: (pod: V1Pod) => Promise<void>
}

export function k8sService(): K8sService{
    function createK8sClient (): Promise<CoreV1Api> {

        return new Promise((resolve, reject) => {
            if (isEmpty(clusterConfig)) {
                reject("Environment variable 'CLUSTER_CONFIG' not set or empty.");
            }

            const k8sCubeConfig = new k8s.KubeConfig();
            k8sCubeConfig.loadFromClusterAndUser(clusterConfig.cluster, clusterConfig.user);
            resolve(k8sCubeConfig.makeApiClient(k8s.CoreV1Api));
        });

    }

    function apply(pod: V1Pod): Promise<http.IncomingMessage>{
        return new Promise((resolve, reject) => {
            createK8sClient()
                .then(k8sApi => {
                    console.debug(`Creating pod ${pod.metadata?.name} in namespace ${clusterConfig.namespace}`);
                    return k8sApi.createNamespacedPod(
                        clusterConfig.namespace,
                        pod)})
                .then(({response}) => {
                    console.debug(`Pod ${pod.metadata?.name} in namespace ${clusterConfig.namespace} created`);
                    resolve(response)
                })
                .catch(error => reject(`Could not apply action because of: ${JSON.stringify(error)}.`));
        });
    }

    function getPodStatus(pod: V1Pod): Promise<V1Pod>{
        if(!pod.metadata?.name) {
            return Promise.reject("Could not get pod status due to missing name");
        }
        const podName = pod.metadata.name;
        return new Promise((resolve, reject) => {
            createK8sClient()
                .then(k8sApi => {
                    console.debug(`Get pod status of ${podName} in namespace ${clusterConfig.namespace}`);
                    return k8sApi.readNamespacedPodStatus(podName, clusterConfig.namespace)
                })
                .then(({body}) => resolve(body))
                .catch(error => reject(`Could not get pod status of ${podName}: ${JSON.stringify(error)}.`));
        });
    }

    /**
     * Deletes the given pod on the cluster. If the pod was not found, the promise resolves without any further action.
     * @param pod Pod to be deleted.
     */
    function deletePod(pod:V1Pod): Promise<void> {
        if(!pod.metadata?.name) {
            return Promise.reject("Could not delete pod due to missing name");
        }
        const podName = pod.metadata.name;
        return new Promise(resolve => {
            createK8sClient()
                .then(k8sApi => {
                    console.debug(`Deleting pod ${podName} in namespace ${clusterConfig.namespace}`);
                    return k8sApi.deleteNamespacedPod(podName, clusterConfig.namespace)
                })
                .then(({body}) => {
                    console.debug(`Deleted pod ${podName} in namespace ${clusterConfig.namespace}`);
                    resolve()
                })
                .catch(error => {
                    console.log(`Could not delete pod ${podName}, because: ${JSON.stringify(error)}.`);
                    resolve()
                })
        })
    }

    return ({
        apply,
        getPodStatus,
        deletePod
    })
}


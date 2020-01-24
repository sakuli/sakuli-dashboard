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
    async function createK8sClient (): Promise<CoreV1Api> {
            if (isEmpty(clusterConfig)) {
                throw Error("Environment variable 'CLUSTER_CONFIG' not set or empty.");
            }

            const k8sCubeConfig = new k8s.KubeConfig();
            k8sCubeConfig.loadFromClusterAndUser(clusterConfig.cluster, clusterConfig.user);
            return k8sCubeConfig.makeApiClient(k8s.CoreV1Api);
    }

    async function apply(pod: V1Pod): Promise<http.IncomingMessage>{
        try {
            const k8sApi = await createK8sClient();
            console.debug(`Creating pod ${pod.metadata?.name} in namespace ${clusterConfig.namespace}`);
            const {response} = await k8sApi.createNamespacedPod(clusterConfig.namespace, pod);
            console.debug(`Pod ${pod.metadata?.name} in namespace ${clusterConfig.namespace} created`);
            return response;
        } catch (error) {
            console.log(`Could not apply action because of: ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async function getPodStatus(pod: V1Pod): Promise<V1Pod>{
        if(!pod.metadata?.name) {
            throw Error("Could not get pod status due to missing name");
        }
        const podName = pod.metadata.name;

        try {
            const k8sApi = await createK8sClient();
            console.debug(`Get pod status of ${podName} in namespace ${clusterConfig.namespace}`);
            const { body } = await k8sApi.readNamespacedPodStatus(podName, clusterConfig.namespace);
            return body
        } catch (error) {
            console.log(`Could not get pod status of ${podName}: ${JSON.stringify(error)}`);
            throw error;
        }
    }

    /**
     * Deletes the given pod on the cluster. If the pod was not found, the promise resolves without any further action.
     * @param pod Pod to be deleted.
     */
    async function deletePod(pod:V1Pod): Promise<void> {
        if(!pod.metadata?.name) {
            throw Error("Could not delete pod due to missing name");
        }
        const podName = pod.metadata.name;

        try {
            const k8sApi = await createK8sClient();
            console.debug(`Deleting pod ${podName} in namespace ${clusterConfig.namespace}`);
            await k8sApi.deleteNamespacedPod(podName, clusterConfig.namespace);
            console.debug(`Deleted pod ${podName} in namespace ${clusterConfig.namespace}`);
        } catch (error) {
            console.log(`Could not delete pod ${podName}: ${JSON.stringify(error)}`);
        }
    }

    return ({
        apply,
        getPodStatus,
        deletePod
    })
}


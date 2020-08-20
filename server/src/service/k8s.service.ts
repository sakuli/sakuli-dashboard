import { CoreV1Api, V1Pod } from "@kubernetes/client-node";
import * as http from "http";
import createBackendError from "../functions/create-backend-error.function";
import { getConfiguration } from "../functions/get-configuration.function";
import { logger } from "../functions/logger";

const k8s = require('@kubernetes/client-node');

function createK8sServiceError(message: string){
    throw createBackendError(`${message}: Cluster config is not defined.`);
}

export async function createK8sClient(): Promise<CoreV1Api> {
    const clusterConfig = getConfiguration()?.k8sClusterConfig
    if(!clusterConfig){
        throw createK8sServiceError("Could not create kubernetes client");
    }
    const k8sCubeConfig = new k8s.KubeConfig();
    k8sCubeConfig.loadFromClusterAndUser(clusterConfig.cluster, clusterConfig.user);
    return k8sCubeConfig.makeApiClient(k8s.CoreV1Api);
}

export async function apply(pod: V1Pod): Promise<http.IncomingMessage>{
    const clusterConfig = getConfiguration()?.k8sClusterConfig
    if(!clusterConfig){
        throw createK8sServiceError("Could apply pod config to cluster");
    }
    try {
        const k8sApi = await createK8sClient();
        logger().info(`Creating pod ${pod.metadata?.name} in namespace ${clusterConfig.namespace}`);
        const {response} = await k8sApi.createNamespacedPod(clusterConfig.namespace, pod);
        logger().debug(`Pod ${pod.metadata?.name} in namespace ${clusterConfig.namespace} created`);
        return response;
    } catch (error) {
        logger().error(`Could not apply pod configuration because of: ${JSON.stringify(error)}`);
        throw createBackendError('Could not apply pod configuration on cluster');
    }
}

export async function getPodStatus(pod: V1Pod): Promise<V1Pod>{
    const clusterConfig = getConfiguration()?.k8sClusterConfig
    if(!clusterConfig){
        throw createK8sServiceError("Could apply get pod status");
    }
    if(!pod.metadata?.name) {
        throw createBackendError("Could not get pod status due to missing name");
    }
    const podName = pod.metadata.name;

    try {
        const k8sApi = await createK8sClient();
        logger().debug(`Get pod status of ${podName} in namespace ${clusterConfig.namespace}`);
        const { body } = await k8sApi.readNamespacedPodStatus(podName, clusterConfig.namespace);
        return body
    } catch (error) {
        logger().error(`Could not get pod status of ${podName}: ${JSON.stringify(error)}`);
        throw createBackendError('Could not get pod status from cluster.');
    }
}

/**
 * Deletes the given pod on the cluster. If the pod was not found, the promise resolves without any further action.
 * @param pod Pod to be deleted.
 */
export async function deletePod(pod:V1Pod): Promise<void> {
    const clusterConfig = getConfiguration()?.k8sClusterConfig
    if(!clusterConfig){
        throw createK8sServiceError("Could not delete pod");
    }
    if(!pod.metadata?.name) {
        throw createBackendError("Could not delete pod due to missing name");
    }
    const podName = pod.metadata.name;

    try {
        const k8sApi = await createK8sClient();
        logger().info(`Deleting pod ${podName} in namespace ${clusterConfig.namespace}`);
        await k8sApi.deleteNamespacedPod(podName, clusterConfig.namespace);
        logger().debug(`Deleted pod ${podName} in namespace ${clusterConfig.namespace}`);
    } catch (error) {
        logger().error(`Could not delete pod ${podName}: ${JSON.stringify(error)}`);
    }
}

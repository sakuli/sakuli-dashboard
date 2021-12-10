import { CoreV1Api, Log, V1Pod } from "@kubernetes/client-node";
import createBackendError from "../functions/create-backend-error.function";
import { getConfiguration } from "../functions/get-configuration.function";
import { logger } from "../functions/logger";
import { Writable } from "stream";

const k8s = require('@kubernetes/client-node');

function createK8sConfigError(message: string){
    const errorMessage = `${message}: Cluster config is not defined.`
    logger().error(errorMessage)
    throw createBackendError(errorMessage)
}

function getKubeConfig(){
    const clusterConfig = getConfiguration()?.k8sClusterConfig
    const k8sCubeConfig = new k8s.KubeConfig();
    k8sCubeConfig.loadFromClusterAndUser(clusterConfig!.cluster, clusterConfig!.user);
    return k8sCubeConfig
}

async function createK8sClient(): Promise<CoreV1Api> {
        return getKubeConfig().makeApiClient(k8s.CoreV1Api);
}

export async function apply(pod: V1Pod) {
    const clusterConfig = getConfiguration()?.k8sClusterConfig
    if(!clusterConfig){
        throw createK8sConfigError("Could not apply pod config to cluster");
    }
    try {
        const k8sApi = await createK8sClient();
        logger().info(`Creating pod ${pod.metadata?.name} in namespace ${clusterConfig.namespace}`);
        const {response, body} = await k8sApi.createNamespacedPod(clusterConfig.namespace, pod);
        logger().debug(`Pod ${pod.metadata?.name} in namespace ${clusterConfig.namespace} created`);
        return {response, body};
    } catch (error) {
        logger().error(`Could not apply pod configuration because of: ${JSON.stringify(error)}`);
        throw createBackendError('Could not apply pod configuration on cluster');
    }
}

export async function getPodStatus(pod: V1Pod) {
    const clusterConfig = getConfiguration()?.k8sClusterConfig
    if(!clusterConfig){
        throw createK8sConfigError("Could not apply get pod status");
    }
    if(!pod.metadata?.name) {
        logger().error(`Could not get pod status due to missing name. Requested pod: ${JSON.stringify(pod)}`)
        throw createBackendError("Could not get pod status due to missing name");
    }
    const podName = pod.metadata.name;

    try {
        const k8sApi = await createK8sClient();
        logger().debug(`Get pod status of ${podName} in namespace ${clusterConfig.namespace}`);
        const { body } = await k8sApi.readNamespacedPodStatus(podName, clusterConfig.namespace);
        return body
    } catch (error: any) {
        if(error.response?.statusCode === 404){ // pod not found on cluster
            logger().debug(`Pod ${podName} does not exist on cluster.`)
            return undefined;
        }
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
        throw createK8sConfigError("Could not delete pod");
    }
    if(!pod.metadata?.name) {
        logger().error(`Could not delete pod due to missing name. Requested pod: ${JSON.stringify(pod)}`)
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
        throw createBackendError("Could not delete pod on cluster");
    }
}

export async function writeLogsToStream(pod: V1Pod, stream: Writable, done: (err?: Error) => void){
    const clusterConfig = getConfiguration()?.k8sClusterConfig
    if(!clusterConfig){
        throw createK8sConfigError("Could not get logs due to missing cluster config");
    }

    if(!pod.metadata?.name) {
        logger().error(`Could not get logs due to missing pod name. Requested pod: ${JSON.stringify(pod)}`)
        throw createBackendError("Could not get logs due to missing pod name");
    }

    const podName = pod.metadata.name;

    try {
        logger().debug(`Get pod logs of ${podName} in namespace ${clusterConfig.namespace}`);
        const kubeConfig = getKubeConfig();
        const log = new Log(kubeConfig)
        await log.log(clusterConfig.namespace, podName, pod.spec!.containers[0].name, stream, done, {follow: false})
    } catch (error) {
        logger().error(`Could not get logs for pod ${podName}: ${JSON.stringify(error)}`);
        throw createBackendError("Could not get logs from cluster");
    }
}
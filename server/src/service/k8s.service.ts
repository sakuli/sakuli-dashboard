import { CoreV1Api } from "@kubernetes/client-node";
import { K8sClusterConfig } from "../config/k8s-cluster.config";
import isEmpty from "../functions/is-emtpy.function";
import { ClusterAction } from "../config/dashboard-actions.config";
import * as http from "http";
import fetch from "node-fetch";
import HttpStatusCode from "../api/HttpStatusCode";
import { CheckPodRequest } from "../api/check-pod-request.interface";

const k8s = require('@kubernetes/client-node');

const clusterConfig = <K8sClusterConfig>JSON.parse(process.env.CLUSTER_CONFIG || "{}");
export interface K8sService {
    apply: (clusterAction: ClusterAction) => Promise<http.IncomingMessage>
    checkPod: (checkPodRequest: CheckPodRequest) => Promise<number>
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

    function apply(clusterAction: ClusterAction): Promise<http.IncomingMessage>{
        return new Promise((resolve, reject) => {
            createK8sClient()
                .then(k8sApi => {
                    return k8sApi.createNamespacedPod(
                        clusterConfig.namespace,
                        clusterAction.action)})
                .then(({response}) => resolve(response))
                .catch(error => reject(`Could not apply action because of: ${JSON.stringify(error)}.`));
        });
    }

    function checkPod(checkPodRequest: CheckPodRequest): Promise<number>{
        const healthEndpoint = checkPodRequest.healthEndpoint;
        console.debug(`fetching url. ${healthEndpoint}`);
        return fetch(healthEndpoint)
            .then(response => {
                console.debug(`checked pod. Returned status code: ${response.status}`);
                return response.status
            })
            .catch((e) => {
                console.log("could not check pod.", e);
                return HttpStatusCode.INTERNAL_SERVER_ERROR
            });
    }

    return ({
        apply,
        checkPod
    })
}


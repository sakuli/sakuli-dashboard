import { V1Pod } from "@kubernetes/client-node";
import { k8sService } from "../service/k8s.service";

export default function podIsDead(pod: V1Pod): Promise<boolean>{
    if(!pod.metadata) {
        return Promise.resolve(true);
    }
    const podName: string = pod.metadata.name || "";

    return k8sService().getPodStatus(podName)
        .then(clusterPod => {
            if(!clusterPod.status?.phase) {
                return true;
            }
            return clusterPod.status.phase !== "Running" && clusterPod.status.phase !== "Pending";
        })
        .catch(e => {
            console.debug(e);
            return true;
        });
}
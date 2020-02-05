import { V1Pod } from "@kubernetes/client-node";
import { k8sService } from "../service/k8s.service";

export default async function podIsDead(pod: V1Pod): Promise<boolean>{
    try {
        const clusterPod = await k8sService().getPodStatus(pod);

        if(!clusterPod.status?.phase) {
            return true;
        }
        return clusterPod.status.phase !== "Running" && clusterPod.status.phase !== "Pending";
    } catch (error) {
        return true;
    }
}
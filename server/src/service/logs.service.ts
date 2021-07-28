import { PodRegistry } from "../registries/pod.registry";
import { writeLogsToStream as getK8sLogs } from "./k8s.service"
import { Writable } from "stream";

export async function writeLogsToStream(actionIdentifier: string, stream: Writable, done: (err?: Error) => void) {
    for (const activePod of PodRegistry.getActivePods()) {
        if(activePod.actionIdentifier === actionIdentifier){
            await getK8sLogs(activePod.pod, stream, done);
            return
        }
    }
    done();
}
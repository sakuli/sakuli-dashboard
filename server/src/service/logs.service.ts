import { DashboardActionRequest } from "@sakuli-dashboard/api";
import { PodRegistry } from "../registries/pod.registry";
import { getLogs as getK8sLogs } from "./k8s.service"
import { logger } from "../functions/logger";

export async function getLogs(dashboardAction: DashboardActionRequest): Promise<string> {
    for (const activePod of PodRegistry.getActivePods()) {
        if(activePod.actionIdentifier === dashboardAction.actionIdentifier){
            return getK8sLogs(activePod.pod);
        }
    }
    logger().debug("There is no active pod for actionIdentifier" + dashboardAction.actionIdentifier)
    return ""
}
import { DashboardActionRequest, DisplayUpdate } from "@sakuli-dashboard/api";
import * as http from "http";
import createBackendError from "../functions/create-backend-error.function";
import { getConfiguration } from "../functions/get-configuration.function";
import { V1Pod } from "@kubernetes/client-node";
import { apply, deletePod, getPodStatus } from "./k8s.service";
import { logger } from "../functions/logger";
import { PodRegistry } from "../registries/pod.registry";

function podCouldNotBeStarted(reason: string) {
    return `Pod could not be started because of: ${reason}`;
}

const validateHttpResponse = (httpResponse: http.IncomingMessage) => {
    if (httpResponse.statusCode !== 201) {
        throw createBackendError(podCouldNotBeStarted(httpResponse.statusMessage || "Unknown reason"));
    }
};

export async function executeAction(dashboardAction: DashboardActionRequest): Promise<DisplayUpdate> {
    const actions = getConfiguration().actionConfig?.actions;
    if (!actions) {
        logger().error(`Received request for cluster action while no actions are configured.`)
        throw createBackendError("No actions configured.");
    }

    const actionToPerform = actions
        .find(action => action.actionIdentifier === dashboardAction.actionIdentifier);

    async function applyPod(podToApply: V1Pod) {
        const {response, body} = await apply(podToApply);
        validateHttpResponse(response);
        PodRegistry.registerPod({
            actionIdentifier: dashboardAction.actionIdentifier, pod: body
        })
    }

    if (actionToPerform?.action.metadata) {
        const actionPod = await getPodStatus(actionToPerform.action);

        if(!actionPod){
            await applyPod(actionToPerform.action)
        }else if(await podIsDead(actionPod)) {
            PodRegistry.deletePod({
                actionIdentifier: dashboardAction.actionIdentifier, pod: actionPod
            })
            await deletePod(actionToPerform.action);
            await applyPod(actionToPerform.action);
        }

        return actionToPerform.displayUpdate || {};
    } else {
        const message = `Requested action '${dashboardAction.actionIdentifier}' not found.`
        logger().error(message)
        throw createBackendError(message);
    }
}

async function podIsDead(pod: V1Pod): Promise<boolean>{
    try {
        if(!pod.status?.phase) {
            return true;
        }
        return pod.status.phase !== "Running" && pod.status.phase !== "Pending";
    } catch (error) {
        return true;
    }
}
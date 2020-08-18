import { DashboardActionRequest, DisplayUpdate } from "@sakuli-dashboard/api";
import { k8sService } from "./k8s.service";
import podIsDead from "../functions/pod-is-dead.function";
import * as http from "http";
import createBackendError from "../functions/create-backend-error.function";
import { getConfiguration } from "../functions/get-configuration.function";

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
        throw createBackendError("No actions configured.");
    }

    const actionToPerform = actions
        .find(action => action.actionIdentifier === dashboardAction.actionIdentifier);

    if (actionToPerform?.action.metadata) {
        if (await podIsDead(actionToPerform.action)) {
            await k8sService().deletePod(actionToPerform.action);
            const httpResponse = await k8sService().apply(actionToPerform.action);
            validateHttpResponse(httpResponse);
        }
        return actionToPerform.displayUpdate || {};
    } else {
        throw createBackendError(`Requested action '${dashboardAction.actionIdentifier}' not found.`);
    }
}
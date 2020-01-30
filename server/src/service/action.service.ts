import { DashboardActionRequest, DisplayUpdate } from "@sakuli-dashboard/api";
import { DashboardActionsConfig } from "../config/dashboard-actions.config";
import { k8sService } from "./k8s.service";
import isEmpty from "../functions/is-emtpy.function";
import podIsDead from "../functions/pod-is-dead.function";
import * as http from "http";
import createBackendError from "../functions/create-backend-error.function";

const actionConfig = (<DashboardActionsConfig>JSON.parse(process.env.ACTION_CONFIG || "{}"));

function podCouldNotBeStarted(reason: string) {
    return `Pod could not be started because of: ${reason}`;
}

const validateHttpResponse = (httpResponse: http.IncomingMessage) => {
    if (httpResponse.statusCode !== 201) {
        throw createBackendError(podCouldNotBeStarted(httpResponse.statusMessage || "Unknown reason"));
    }
};

export async function executeAction(dashboardAction: DashboardActionRequest): Promise<DisplayUpdate> {
        if (isEmpty(actionConfig)) {
            throw createBackendError("Environment variable 'ACTION_CONFIG' not set.");
        }
        if(!actionConfig.actions) {
            throw createBackendError("No action in environment variable 'ACTION_CONFIG'");
        }

        const actionToPerform = actionConfig
            .actions
            .find(action => action.actionIdentifier === dashboardAction.actionIdentifier);

        if (actionToPerform?.action.metadata) {
            if (await podIsDead(actionToPerform.action)) {
                try {
                    await k8sService().deletePod(actionToPerform.action);
                    const httpResponse = await k8sService().apply(actionToPerform.action);
                    validateHttpResponse(httpResponse);
                } catch (error) {
                    throw error;
                }
            }
            return actionToPerform.displayUpdate || {};
        } else {
            throw createBackendError(`Requested action '${dashboardAction.actionIdentifier}' not found.`);
        }
}
import { DashboardActionRequest } from "..";
import { ClusterAction, DashboardActionsConfig, DisplayUpdate } from "../config/dashboard-actions.config";
import { k8sService } from "./k8s.service";
import isEmpty from "../functions/is-emtpy.function";
import podIsDead from "../functions/pod-is-dead.function";

const actionConfig = (<DashboardActionsConfig>JSON.parse(process.env.ACTION_CONFIG || "{}"));

function podCouldNotBeStarted(reason: string) {
    return `Pod could not be started because of: ${reason}`;
}

export function executeAction(dashboardAction: DashboardActionRequest): Promise<DisplayUpdate> {
    return new Promise(async (resolve, reject) => {
        if (isEmpty(actionConfig)) {
            reject("Environment variable 'ACTION_CONFIG' not set.");
        }

        const actionToPerform: ClusterAction | undefined = actionConfig
            .actions
            .find(action => action.actionIdentifier === dashboardAction.actionIdentifier);

        if (actionToPerform && actionToPerform.action.metadata) {
            if (await podIsDead(actionToPerform.action)) {
                k8sService().deletePod(actionToPerform.action)
                    .then(() => k8sService().apply(actionToPerform))
                    .then(httpResponse => {
                        if (httpResponse.statusCode !== 201) {
                            reject(podCouldNotBeStarted(httpResponse.statusMessage || "Unknown reason"));
                        }
                    })
                    .catch(error => reject(podCouldNotBeStarted(error)));
            }
            resolve(actionToPerform.displayUpdate || {});
        } else {
            reject(`Requested action '${dashboardAction.actionIdentifier}' not found.`)
        }
    });
}
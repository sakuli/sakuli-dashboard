import { DashboardActionRequest } from "../api/dashboard-action-request.interface";
import { ClusterAction, DashboardActionsConfig, DisplayUpdate } from "../config/dashboard-actions.config";
import { k8sService, K8sService } from "./k8s.service";

const actionConfig = process.env.ACTION_CONFIG;

function podCouldNotBeStarted(reason: string){
    return `Pod could not be started because of: ${reason}`;
}

export function executeAction(dashboardAction: DashboardActionRequest) : Promise<DisplayUpdate> {
    return new Promise((resolve, reject) => {
        if(!actionConfig){
            reject("Environment variable 'ACTION_CONFIG' not set.");
        }

        const actionToPerform: ClusterAction | undefined = (<DashboardActionsConfig> JSON.parse(actionConfig || "{}"))
            .actions
            .find(action => action.actionIdentifier === dashboardAction.actionIdentifier);

        if(actionToPerform){
            k8sService().apply(actionToPerform)
                .then(httpResponse => {
                    if(httpResponse.statusCode === 200){
                        resolve(actionToPerform.displayUpdate);
                    }
                    reject(podCouldNotBeStarted(httpResponse.statusMessage || "Unknown reason"));
                })
                .catch(error => reject(podCouldNotBeStarted(error)));
        }else{
            reject(`Requested action '${dashboardAction.actionIdentifier}' not found.`)
        }
    });
}
import { DashboardActionRequest } from "../api/dashboard-action-request.interface";
import { ClusterAction, DashboardActionsConfig } from "../config/dashboard-actions.config";
import { DashboardActionResponse } from "../api/dashboard-action-response.interface";

const actionConfig = process.env.ACTION_CONFIG;

export function executeAction(dashboardAction: DashboardActionRequest) : Promise<DashboardActionResponse> {
    return new Promise(function(resolve, reject) {
        if(!actionConfig){
            reject("Environment variable 'ACTION_CONFIG' not set.");
        }

        const actionToPerform: ClusterAction | undefined = (<DashboardActionsConfig> JSON.parse(actionConfig || "{}"))
            .actions
            .find(action => action.actionIdentifier === dashboardAction.actionIdentifier);

        if(actionToPerform){
            //TODO: Replace with k8s magic
            resolve(actionToPerform.displayUpdate)
        }else{
            reject(`Requested action '${dashboardAction.actionIdentifier}' not found.`)
        }
    });
}
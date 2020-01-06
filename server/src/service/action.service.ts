import { DashboardActionRequest } from "../api/dashboard-action-request.interface";
import { ClusterAction, DashboardActionsConfig, DisplayUpdate } from "../config/dashboard-actions.config";
import { k8sService } from "./k8s.service";
import isEmpty from "../functions/is-emtpy.function";

const actionConfig = (<DashboardActionsConfig> JSON.parse(process.env.ACTION_CONFIG || "{}"));

function podCouldNotBeStarted(reason: string){
    return `Pod could not be started because of: ${reason}`;
}

export function executeAction(dashboardAction: DashboardActionRequest) : Promise<DisplayUpdate> {
    return new Promise((resolve, reject) => {
        if(isEmpty(actionConfig)){
            reject("Environment variable 'ACTION_CONFIG' not set.");
        }

        const actionToPerform: ClusterAction | undefined = actionConfig
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
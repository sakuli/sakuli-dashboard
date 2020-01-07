import { DashboardActionRequest } from "../../../server/src/api/dashboard-action-request.interface";
import { DashboardConfigResponse } from "../../../server/src/api/dashboard-config-response.interface";
import { DashboardActionResponse } from "../../../server/src/api/dashboard-action-response.interface";

export function invokeAction (request: DashboardActionRequest): Promise<DashboardActionResponse> {
    return fetch('/api/dashboard/action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(response => response.json());
}

export function getDashboardConfig(): Promise<DashboardConfigResponse> {
    return fetch('/api/dashboard')
            .then(r => r.json());
}
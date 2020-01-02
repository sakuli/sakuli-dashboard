import { DashboardActionRequest } from "../../server/src/api/dashboard-action-request.interface";

export function invokeAction (request: DashboardActionRequest) {
    return fetch('/api/dashboard/action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(response => response.json());
}

export function getDashboardConfig(){
    return fetch('/api/dashboard')
            .then(r => r.json());
}
import {
    CheckPodRequest,
    CheckPodResponse,
    DashboardActionRequest,
    DashboardActionResponse,
    DashboardConfigResponse
} from "server";

export function invokeAction (request: DashboardActionRequest): Promise<DashboardActionResponse> {
    return fetch('/api/dashboard/action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(response => response.json());
}

export function checkUrl(request: CheckPodRequest): Promise<CheckPodResponse> {
    return fetch ('/api/dashboard/checkPod', {
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
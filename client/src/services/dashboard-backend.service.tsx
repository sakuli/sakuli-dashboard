import {
    BackendError,
    DashboardActionRequest,
    DashboardActionResponse,
    DashboardConfigResponse,
    HealthCheckRequest,
    HealthCheckResponse
} from "@sakuli-dashboard/api";

export function invokeAction (request: DashboardActionRequest): Promise<DashboardActionResponse | BackendError> {
    return fetch('/api/dashboard/action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(response => response.json());
}

export function healthCheck(request: HealthCheckRequest): Promise<HealthCheckResponse> {
    return fetch ('/api/dashboard/health-check', {
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
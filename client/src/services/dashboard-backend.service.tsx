import {
    BackendError,
    DashboardActionRequest,
    DashboardActionResponse,
    DashboardConfigResponse,
    HealthCheckRequest,
    HealthCheckResponse,
    LoginResponse,
    SecurityConfigResponse
} from "@sakuli-dashboard/api";

export function invokeAction (request: DashboardActionRequest, jwtToken?: string): Promise<DashboardActionResponse | BackendError> {
    return fetch('/api/dashboard/action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthorizationHeader(jwtToken)
        },
        body: JSON.stringify(request)
    }).then(response => response.json());
}

export function healthCheck(request: HealthCheckRequest, jwtToken?: string): Promise<HealthCheckResponse> {
    return fetch ('/api/dashboard/health-check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthorizationHeader(jwtToken)
        },
        body: JSON.stringify(request)
    }).then(response => response.json());
}
export function getDashboardConfig(jwtToken?: string): Promise<DashboardConfigResponse | BackendError> {
    return fetch('/api/dashboard', {
                headers: {
                    ...getAuthorizationHeader(jwtToken)
                }
            })
            .then(r => r.json());
}

export function getLogsOfAction(actionIdentifier: string, jwtToken?: string): Promise<string> {
    return fetch("/api/dashboard/action/logs/" + actionIdentifier, {
        headers: {
            ...getAuthorizationHeader(jwtToken)
        }
    })
        .then(r => r.text());
}

export function getSecurityConfig(): Promise<SecurityConfigResponse> {
    return fetch('api/security', {
    }).then(r => r.json());
}

export function performLogin(username: string, password: string): Promise<LoginResponse> {
    return fetch('api/login', {
        headers: {
            'Authorization': "Basic " + Buffer.from(`${username}:${password}`).toString('base64')
        }
    }).then(r => r.json())
        .catch(() => undefined);
}

export function refreshLoginInformation(jwtRefreshToken: string): Promise<LoginResponse> {
    return fetch('api/token/refresh', {
        headers: {
            ...(getAuthorizationHeader(jwtRefreshToken))
        }
    }).then(r => r.json())
        .catch(() => undefined);
}

function getAuthorizationHeader(jwtToken?: string): Record<string, string> {
    if(jwtToken){
        return {Authorization: "Bearer " + jwtToken}
    }
    return {}
}
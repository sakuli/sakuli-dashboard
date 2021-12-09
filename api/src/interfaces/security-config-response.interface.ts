export interface SecurityConfigResponse {
    authorizationEnabled: boolean
}

export function isSecurityConfig(json: any): json is SecurityConfigResponse {
    return json && typeof json.authorizationEnabled === "boolean"
}

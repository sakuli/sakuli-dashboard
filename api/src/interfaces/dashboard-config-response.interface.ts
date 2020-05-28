import { Display } from ".";

export interface DashboardConfigResponse {
  displays: Display[]
}

export function isDashboardConfigResponse(response: any): response is DashboardConfigResponse {
  return (response as DashboardConfigResponse).displays !== undefined;
}
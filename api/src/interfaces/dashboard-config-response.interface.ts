import { Display, LayoutMode } from ".";

export interface DashboardConfigResponse {
  displays: Display[]
  layout?: LayoutMode
}

export function isDashboardConfigResponse(response: any): response is DashboardConfigResponse {
  return (response as DashboardConfigResponse).displays !== undefined;
}
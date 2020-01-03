import { DashboardConfigResponse } from "../api/dashboard-config-response.interface";

export function getDashboardConfig(): DashboardConfigResponse {
    return JSON.parse(process.env.DASHBOARD_CONFIG || "{}");
}
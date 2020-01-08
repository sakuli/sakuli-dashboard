import { DashboardConfig } from "../config/dashboard.config";

export function getDashboardConfig(): DashboardConfig {
    return JSON.parse(process.env.DASHBOARD_CONFIG || "{}");
}
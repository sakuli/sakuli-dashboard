import { DashboardActionResponse, LayoutMode } from "@sakuli-dashboard/api";

export interface DashboardConfig extends DashboardActionResponse{
    defaultLayout: LayoutMode
}
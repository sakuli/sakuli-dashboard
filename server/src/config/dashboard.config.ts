import { Display, LayoutMode } from "@sakuli-dashboard/api";

export interface DashboardConfig {
    displays: Display[]
    defaultLayout: LayoutMode
}
import { DashboardActionRequest } from "@sakuli-dashboard/api";

export interface CronjobConfig extends DashboardActionRequest {
    schedule: string
}
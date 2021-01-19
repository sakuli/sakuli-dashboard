import { DashboardConfig } from "../config/dashboard.config";
import { logger } from "../functions/logger";
import { HttpStatusCode } from "@sakuli-dashboard/api/dist/HttpStatusCode";
import createBackendError from "../functions/create-backend-error.function";

export function handleGetDashboard(dashboardConfiguration?: DashboardConfig){
    return (req: any, res: any) => {
        if(dashboardConfiguration) {
            res.send(dashboardConfiguration);
        } else {
            const errorMessage = "Dashboard config not defined.";
            logger().error(errorMessage);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(createBackendError(errorMessage));
        }
    };
}
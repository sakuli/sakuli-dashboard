import cron from "node-cron";
import { CronjobConfig } from "../config/cronjob.config";
import { executeAction } from "./action.service";
import { logger } from "../functions/logger";

export function configureCronjob(cronjobConfig: CronjobConfig) {
    logger().debug(`Creating Cronjob with Action ${cronjobConfig.actionIdentifier} and Schedule ${cronjobConfig.schedule}`);
    cron.schedule(cronjobConfig.schedule, async () => {
        logger().info(`Started action ${cronjobConfig.actionIdentifier} via Cronjob`);
        await executeAction(cronjobConfig);
    })
    logger().info("Successfully created cronjob");
}
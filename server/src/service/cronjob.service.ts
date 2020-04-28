import cron from "node-cron";
import { CronjobConfig } from "../config/cronjob.config";
import { executeAction } from "./action.service";

export function configureCronjob(cronjobConfig: CronjobConfig) {
    console.log(`Creating Cronjob with Action ${cronjobConfig.actionIdentifier} and Schedule ${cronjobConfig.schedule}`);
    cron.schedule(cronjobConfig.schedule, async () => {
        console.log(`Started action ${cronjobConfig.actionIdentifier} via Cronjob`);
        await executeAction(cronjobConfig);
    })
    console.log("Successfully created cronjob");
}
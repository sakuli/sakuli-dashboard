import { mockPartial } from "sneer";
import { configureCronjob } from "./cronjob.service";
import { logger } from "../functions/logger";
import { schedule, ScheduledTask, ScheduleOptions } from "node-cron";
import { executeAction } from "./action.service";
import { CronjobConfig } from "../config/cronjob.config";

jest.mock("../functions/logger")
jest.mock("./action.service")
jest.mock("node-cron");

describe("cronjob service", () => {

    beforeEach(() => {
        jest.resetModules()
    })

    const cronjobConfig: CronjobConfig = {
        schedule: "0 0 * * *",
        actionIdentifier: "7890eab9-6c5e-4e40-b39c-163900ea4834"
    }

    it("should create cronjob", () => {

        //WHEN
        configureCronjob(cronjobConfig);

        //THEN
        expect(schedule).toBeCalledWith(cronjobConfig.schedule, expect.any(Function))
    })

    it("should execute action if cronjob is triggered", async () => {

        //GIVEN
        (schedule as jest.Mock).mockImplementation(
            (cronExpression: string, func: () => void, options?: ScheduleOptions) => {
                func();
                return mockPartial<ScheduledTask>({})
            })

        //WHEN
        configureCronjob(cronjobConfig);

        //THEN
        expect(executeAction).toBeCalledWith(cronjobConfig)
    })

    it("should log if cronjob config is missing", () =>{

        //WHEN
        configureCronjob(undefined);

        //THEN
        expect(logger().debug).toBeCalledWith("Cronjob config is empty or undefined");
    })
})
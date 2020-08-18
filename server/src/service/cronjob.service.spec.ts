jest.mock("../functions/logger")
jest.mock("./action.service")

import { configureCronjob } from "./cronjob.service";
import { logger } from "../functions/logger";

describe("cronjob service", () => {

    it("should create cronjob", () => {

        //GIVEN

        //WHEN

        //THEN

    })

    it("should log if cronjob config is missing", () =>{

        //GIVEN

        //WHEN
        configureCronjob(undefined);

        //THEN
        expect(logger().debug).toBeCalledWith("Cronjob config is empty or undefined");
    })
})
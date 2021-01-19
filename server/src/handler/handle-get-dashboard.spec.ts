import { DashboardConfig } from "../config/dashboard.config";
import { handleGetDashboard } from "./handle-get-dashboard";
import { HttpStatusCode } from "@sakuli-dashboard/api/dist/HttpStatusCode";

describe('handle get dashboard', () => {
    it("should resolve with dashboard config", () => {

        //GIVEN
        const dashboardConfig: DashboardConfig = {
            defaultLayout: "column",
            pollingInterval: 400,
            url: "http://foo.bar"
        }

        const req = jest.fn()

        const sendResponse = jest.fn()
        const res = {send: sendResponse}

        //WHEN
        handleGetDashboard(dashboardConfig)(req, res);


        //THEN
        expect(sendResponse).toBeCalledWith(dashboardConfig)
    })

    it("should return an internal server error in case no dashboard conifig is provided", () => {

        //GIVEN
        const req = jest.fn()

        const sendResponse = jest.fn()
        const setStatus = jest.fn(() => {
            return {send: sendResponse}
        })
        const res = {
            status: setStatus
        }

        //WHEN
        handleGetDashboard(undefined)(req, res);

        //THEN
        expect(setStatus).toBeCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR)
        expect(sendResponse).toBeCalledWith({ message: expect.any(String)})

    })
});
import { DashboardConfigResponse } from "@sakuli-dashboard/api";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./dashboard";
import DashboardDisplays from "./dashboard-displays";

jest.mock("./dashboard-displays")

jest.mock("./dashboard-header", () => {
    return () => null
})

jest.mock("./dashboard-placeholder", () => {
    return () => null
})


describe("dashboard", () => {

    const dashboardConfigResponse: DashboardConfigResponse = {
        displays: [
            {
                actionIdentifier: "42",
                index: 1,
                messages: {
                    "de": {
                        description: "foo",
                        infoText: "foobar"
                    }
                },
                url: "http://consol.de",
                height: "42",
                width: "42"
            }
        ],
        layout: "foobar"
    };

    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(dashboardConfigResponse)));

        (DashboardDisplays as jest.Mock).mockImplementation(() => {
            return(
                <div data-testid={"dashboard-displays"}/>
            )
        })
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("display dashboards rendering", () => {
        it("should use data from backend", async () => {

            //WHEN
            render(<Dashboard/>);

            //THEN
            await waitFor(() => screen.getByTestId("dashboard-displays"))
            expect(DashboardDisplays).toHaveBeenLastCalledWith(expect.objectContaining(dashboardConfigResponse), expect.anything())
        })

        it("should pass locale", async () => {

            //WHEN
            render(<Dashboard/>);

            //THEN
            await waitFor(() => screen.getByTestId("dashboard-displays"))
            expect(DashboardDisplays).toHaveBeenLastCalledWith(expect.objectContaining({locale: expect.anything()}), expect.anything())
        })
    })

});
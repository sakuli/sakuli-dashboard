import { BackendError, DashboardConfigResponse } from "@sakuli-dashboard/api";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./dashboard";
import DashboardDisplays, { DisplaysProps } from "./dashboard-displays";
import DashboardPlaceholder from "./dashboard-placeholder";

jest.mock("./dashboard-displays")

jest.mock("./dashboard-header", () => {
    return () => null
})

jest.mock("./dashboard-placeholder")


describe("dashboard", () => {

    beforeEach(() => {
        (DashboardDisplays as jest.Mock).mockImplementation(() => {
            return(
                <div data-testid={"dashboard-displays"}/>
            )
        });

        (DashboardPlaceholder as jest.Mock).mockImplementation(() => {
            return(
                <div data-testid={"dashboard-placeholder"}/>
            )
        })
    })

    afterEach(() => {
        jest.restoreAllMocks();
        localStorage.removeItem("dashboard-layout")
    });

    describe("display dashboards rendering", () => {

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
            defaultLayout: "column"
        };

        const expectedProps: DisplaysProps  = {
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
            layout: "column",
            locale: "en"
        };

        beforeEach(() => {
            jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(dashboardConfigResponse)));
        });

        it("should use data from backend", async () => {

            //WHEN
            render(<Dashboard/>);

            //THEN
            await waitFor(() => screen.getByTestId("dashboard-displays"))
            expect(DashboardDisplays).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), expect.anything())
        })

        it("should not set layout from backend if undefined", async () => {

            //GIVEN
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
                ]
            };
            jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(dashboardConfigResponse)));

            //WHEN
            render(<Dashboard/>);

            //THEN
            await waitFor(() => screen.getByTestId("dashboard-displays"))
            expect(DashboardDisplays).toHaveBeenLastCalledWith(expect.objectContaining({...expectedProps, layout: "column"}), expect.anything())

        })

        it("should not set layout from backend if current layout comes from storage", async () => {

            //GIVEN
            localStorage.setItem("dashboard-layout", "row")

            //WHEN
            render(<Dashboard/>);

            //THEN
            await waitFor(() => screen.getByTestId("dashboard-displays"))
            expect(DashboardDisplays).toHaveBeenLastCalledWith(expect.objectContaining({...expectedProps, layout: "row"}), expect.anything())
        })

        it("should pass locale", async () => {

            //WHEN
            render(<Dashboard/>);

            //THEN
            await waitFor(() => screen.getByTestId("dashboard-displays"))
            expect(DashboardDisplays).toHaveBeenLastCalledWith(expect.objectContaining({locale: expect.anything()}), expect.anything())
        })
    })

    describe("dashboard placeholder", () => {

        const backendError: BackendError = {
            message: "foobar"
        };

        beforeEach(() => {
            jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(backendError)));
        });

        it("should render error screen", async () => {

            //WHEN
            render(<Dashboard/>);

            //THEN
            await waitFor(() => screen.getByTestId("dashboard-placeholder"))
            expect(DashboardPlaceholder).toHaveBeenLastCalledWith({backendError}, expect.anything())

        })
    })

});
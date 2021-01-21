import { Display, LayoutMode } from "@sakuli-dashboard/api";
import DashboardDisplays from "./dashboard-displays";
import { render } from "@testing-library/react";
import DashboardDisplay from "./dashboard-display";
import React from "react";

jest.mock("./dashboard-display")

describe("dashboard displays", () => {

    test.each<[LayoutMode, string]>([
        ["row", "row"],
        ["column", "row row-cols-2"]
    ])("should render displays in %s layout", (layout: LayoutMode, expectedClass: string) => {

        //WHEN
        const {container} = render(<DashboardDisplays displays={[]} layout={layout} locale={""}/>);

        //THEN
        expect(container.firstChild).toHaveClass(expectedClass)
    })

    it("should render all displays with locale", () => {

        //GIVEN
        const display1: Display = {
            actionIdentifier: "84",
            index: 1,
            messages: {
                "fr": {
                    description: "foo",
                    infoText: "foobar"
                }
            },
            url: "http://consol.de",
            height: "84",
            width: "84"
        }
        const display2: Display = {
            actionIdentifier: "42",
            index: 2,
            messages: {
                "fr": {
                    description: "foo",
                    infoText: "foobar"
                }
            },
            url: "http://google.de",
            height: "42",
            width: "42"
        }
        const displays: Display[] = [display2, display1]
        const locale = "fr"
        const layout: LayoutMode = "row";

        (DashboardDisplay as jest.Mock).mockImplementation(() => {
            return(
                <div data-testid={"dashboard-display"}/>
            )
        })

        //WHEN
        render(<DashboardDisplays displays={displays} layout={layout} locale={locale}/>);

        //THEN
        expect(DashboardDisplay).toHaveBeenNthCalledWith(1, expect.objectContaining({display: display1, locale: locale, layout: layout}), expect.anything())
        expect(DashboardDisplay).toHaveBeenNthCalledWith(2, expect.objectContaining({display: display2, locale: locale, layout: layout}), expect.anything())
    })
})
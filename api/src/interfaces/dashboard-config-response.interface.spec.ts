import { isDashboardConfigResponse } from "./dashboard-config-response.interface";

describe("dashboard config response", () => {
    describe("type guard", () => {
        const correctDisplay = {
            index: 1,
            messages: {en: {description: "description", infoText: "info"}},
            url: "https://sakuli.io",
            width: "7680",
            height: "4320",
            actionIdentifier: "id-42"
        }

        it("should not identify as DashboardConfigResponse when undefined", () => {
            // GIVEN
            const dashboardConfigResponse = undefined;

            // WHEN
            const typeGuardResult = isDashboardConfigResponse(dashboardConfigResponse);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as DashboardConfigResponse when empty", () => {
            // GIVEN
            const dashboardConfigResponse = {};

            // WHEN
            const typeGuardResult = isDashboardConfigResponse(dashboardConfigResponse);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["displays", {someCrazyProperty: 42, defaultLayout: "row"}],
            ["defaultLayout", {displays: [correctDisplay], someCrazyProperty: 42}]
        ])("should not identify as DashboardConfigResponse when %s is replaced by random field", (_, dashboardConfigResponse) => {
            // WHEN
            const typeGuardResult = isDashboardConfigResponse(dashboardConfigResponse);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["displays", {displays: {foo: 42}, defaultLayout: "row"}],
            ["defaultLayout", {displays: [correctDisplay], defaultLayout: 42}]
        ])("should not identify as DashboardConfigResponse when %s is a different type", (_, dashboardConfigResponse) => {
            // WHEN
            const typeGuardResult = isDashboardConfigResponse(dashboardConfigResponse);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as DashboardConfigResponse when only mandatory field is set", () => {
            // GIVEN
            const dashboardConfigResponse = {
                displays: [correctDisplay]
            };

            // WHEN
            const typeGuardResult = isDashboardConfigResponse(dashboardConfigResponse);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });

        it("should identify as DashboardConfigResponse when all fields are set correctly", () => {
            // GIVEN
            const dashboardConfigResponse = {
                displays: [correctDisplay],
                defaultLayout: "row"
            };

            // WHEN
            const typeGuardResult = isDashboardConfigResponse(dashboardConfigResponse);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
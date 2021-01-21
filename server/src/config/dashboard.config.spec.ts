import { isDashboardConfig } from "./dashboard.config";

describe("dashboard config", () => {
    describe("type guard", () => {
        const correctDisplay = {
            index: 1,
            messages: {en: {description: "description", infoText: "info"}},
            url: "https://sakuli.io",
            width: "7680",
            height: "4320",
            actionIdentifier: "id-42"
        }

        it("should not identify as DashboardConfig when undefined", () => {
            // GIVEN
            const dashboardConfig = undefined;

            // WHEN
            const typeGuardResult = isDashboardConfig(dashboardConfig);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as DashboardConfig when empty", () => {
            // GIVEN
            const dashboardConfig = {};

            // WHEN
            const typeGuardResult = isDashboardConfig(dashboardConfig);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["displays", {someCrazyProperty: 42, defaultLayout: "row"}],
            ["defaultLayout", {displays: [correctDisplay], someCrazyProperty: 42}]
        ])("should not identify as DashboardConfig when %s is replaced by random field", (_, dashboardConfig) => {
            // WHEN
            const typeGuardResult = isDashboardConfig(dashboardConfig);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["displays", {displays: {foo: 42}, defaultLayout: "row"}],
            ["defaultLayout", {displays: [correctDisplay], defaultLayout: 42}]
        ])("should not identify as DashboardConfig when %s is a different type", (_, dashboardConfig) => {
            // WHEN
            const typeGuardResult = isDashboardConfig(dashboardConfig);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as DashboardConfig when only mandatory field is set", () => {
            // GIVEN
            const dashboardConfig = {
                displays: [correctDisplay]
            };

            // WHEN
            const typeGuardResult = isDashboardConfig(dashboardConfig);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });

        it("should identify as DashboardConfig when all fields are set correctly", () => {
            // GIVEN
            const dashboardConfig = {
                displays: [correctDisplay],
                defaultLayout: "row"
            };

            // WHEN
            const typeGuardResult = isDashboardConfig(dashboardConfig);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
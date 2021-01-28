import { isDashboardActionRequest } from "./dashboard-action-request.interface";

describe("dashboard action request", () => {
    describe("type guard", () => {
        it("should not identify as DashboardActionRequest when undefined", () => {
            // GIVEN
            const dashboardActionRequest = undefined;

            // WHEN
            const typeGuardResult = isDashboardActionRequest(dashboardActionRequest);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as DashboardActionRequest when set with different type", () => {
            // GIVEN
            const dashboardActionRequest = 42;

            // WHEN
            const typeGuardResult = isDashboardActionRequest(dashboardActionRequest);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as DashboardActionRequest when actionIdentifier is set with different type", () => {
            // GIVEN
            const dashboardActionRequest = {actionIdentifier: 42};

            // WHEN
            const typeGuardResult = isDashboardActionRequest(dashboardActionRequest);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as DashboardActionRequest when set correctly", () => {
            // GIVEN
            const dashboardActionRequest = {actionIdentifier: "id-42"};

            // WHEN
            const typeGuardResult = isDashboardActionRequest(dashboardActionRequest);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
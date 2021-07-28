import { isDisplayType } from "./displayType.interface";


describe("display type", () => {
    describe("type guard", () => {
        it("should not identify as DisplayType when undefined", () => {
            // GIVEN
            const layoutMode = undefined;

            // WHEN
            const typeGuardResult = isDisplayType(layoutMode);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as DisplayType when set as random string", () => {
            // GIVEN
            const layoutMode = "foo";

            // WHEN
            const typeGuardResult = isDisplayType(layoutMode);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as DisplayType when different type", () => {
            // GIVEN
            const layoutMode = 123;

            // WHEN
            const typeGuardResult = isDisplayType(layoutMode);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as DisplayType when set as website", () => {
            // GIVEN
            const layoutMode = "website";

            // WHEN
            const typeGuardResult = isDisplayType(layoutMode);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });

        it("should identify as DisplayType when set as logs", () => {
            // GIVEN
            const layoutMode = "logs";

            // WHEN
            const typeGuardResult = isDisplayType(layoutMode);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
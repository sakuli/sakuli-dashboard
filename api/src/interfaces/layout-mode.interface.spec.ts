import { isLayoutMode } from "./layout-mode.interface";

describe("layout mode", () => {
    describe("type guard", () => {
        it("should not identify as LayoutMode when undefined", () => {
            // GIVEN
            const layoutMode = undefined;

            // WHEN
            const typeGuardResult = isLayoutMode(layoutMode);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as LayoutMode when set as random string", () => {
            // GIVEN
            const layoutMode = "foo";

            // WHEN
            const typeGuardResult = isLayoutMode(layoutMode);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as LayoutMode when different type", () => {
            // GIVEN
            const layoutMode = 123;

            // WHEN
            const typeGuardResult = isLayoutMode(layoutMode);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as LayoutMode when set as row", () => {
            // GIVEN
            const layoutMode = "row";

            // WHEN
            const typeGuardResult = isLayoutMode(layoutMode);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });

        it("should not identify as LayoutMode when set as column", () => {
            // GIVEN
            const layoutMode = "column";

            // WHEN
            const typeGuardResult = isLayoutMode(layoutMode);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
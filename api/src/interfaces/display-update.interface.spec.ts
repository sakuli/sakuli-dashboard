import { isDisplayUpdate } from "./display-update.interface";

describe("display update", () => {
    describe("type guard", () => {
        it("should not identify as DisplayUpdate when undefined", () => {
            // GIVEN
            const displayUpdate = undefined;

            // WHEN
            const typeGuardResult = isDisplayUpdate(displayUpdate);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as DisplayUpdate when empty", () => {
            // GIVEN
            const displayUpdate = {};

            // WHEN
            const typeGuardResult = isDisplayUpdate(displayUpdate);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });

        it.each([
            ["url", {url: 42}],
            ["pollingInterval", {pollingInterval: "foo"}]
        ])("should not identify as DisplayUpdate when %s is set with different type", (_, displayUpdate) => {
            // WHEN
            const typeGuardResult = isDisplayUpdate(displayUpdate);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as DisplayUpdate when only url is set", () => {
            // GIVEN
            const displayUpdate = {url: "https://sakuli.io"};

            // WHEN
            const typeGuardResult = isDisplayUpdate(displayUpdate);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });

        it("should identify as DisplayUpdate when only pollingInterval is set", () => {
            // GIVEN
            const displayUpdate = {pollingInterval: 42};

            // WHEN
            const typeGuardResult = isDisplayUpdate(displayUpdate);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });

        it("should identify as DisplayUpdate when both optional fields are set", () => {
            // GIVEN
            const displayUpdate = {url: "https://sakuli.io", pollingInterval: 42};

            // WHEN
            const typeGuardResult = isDisplayUpdate(displayUpdate);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
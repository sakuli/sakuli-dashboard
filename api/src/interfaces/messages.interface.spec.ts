import {isMessages} from "./messages.interface";

describe("messages interface", () => {
    describe("type guard", () => {
        it("should not identify as Messages when undefined", () => {
            // GIVEN
            const messages = undefined;

            // WHEN
            const typeGuardResult = isMessages(messages);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as Messages when empty", () => {
            // GIVEN
            const messages = {};

            // WHEN
            const typeGuardResult = isMessages(messages);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["description", {infoText: "Al pastor Taco", description: 42}],
            ["infoText", {infoText: 42, description: "With brand new recipe"}]
        ])("should not identify as Messages when field %s is a different type", (_, messages) => {
            // WHEN
            const typeGuardResult = isMessages(messages);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["description", {infoText: "Al pastor Taco", someCrazyProperty: 42}],
            ["infoText", {description: "With brand new recipe", someCrazyProperty: 42}]
        ])("should not identify as Messages when random property is set for %s", (_, messages) => {
            // WHEN
            const typeGuardResult = isMessages(messages);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as Messages when all fields are set correctly", () => {
            // GIVEN
            const messages = {
                infoText: "Al pastor Taco",
                description: "With brand new recipe"
            };

            // WHEN
            const typeGuardResult = isMessages(messages);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
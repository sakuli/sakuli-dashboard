import { isDisplay } from "./display.interface";

describe("display interface", () => {
    describe("type guard", () => {
        it("should not identify as Display when undefined", () => {
            // GIVEN
            const display = undefined;

            // WHEN
            const typeGuardResult = isDisplay(display);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as Display when empty", () => {
            //GIVEN
            const display = {};

            // WHEN
            const typeGuardResult = isDisplay(display);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["index", {
                someCrazyProperty: 42,
                messages: {en: {description: "description", infoText: "info"}},
                url: "https://sakuli.io",
                width: "7680",
                height: "4320",
                actionIdentifier: "id-42"
            }],
            ["url", {
                index: 1,
                messages: {en: {description: "description", infoText: "info"}},
                someCrazyProperty: 42,
                width: "7680",
                height: "4320",
                actionIdentifier: "id-42"
            }]
        ])("should not identify as Display when mandatory %s is replaced with random field", (_, display) => {
            // WHEN
            const typeGuardResult = isDisplay(display);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["index", {
                index: "foo",
                messages: {en: {description: "description", infoText: "info"}},
                url: "https://sakuli.io",
                width: "7680",
                height: "4320",
                actionIdentifier: "id-42"
            }],
            ["url", {
                index: 1,
                messages: {en: {description: "description", infoText: "info"}},
                url: 42,
                width: "7680",
                height: "4320",
                actionIdentifier: "id-42"
            }]
        ])("should not identify as Display when mandatory %s is replaced set with different type", (_, display) => {
            // WHEN
            const typeGuardResult = isDisplay(display);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["no optional properties are", {
                index: 1,
                url: "https://sakuli.io",
            }],

            ["messages is", {
                index: 0,
                messages: {en: {description: "description", infoText: "info"}},
                url: "https://sakuli.io"
            }],
            ["width is", {
                index: 1,
                url: "https://sakuli.io",
                width: "7680",
            }],
            ["height is", {
                index: 1,
                url: "https://sakuli.io",
                height: "4320",
            }],
            ["actionIdentifier is", {
                index: 1,
                url: "https://sakuli.io",
                actionIdentifier: "id-42"
            }],
            ["all values are", {
                index: 1,
                messages: {en: {description: "description", infoText: "info"}},
                url: "https://sakuli.io",
                width: "7680",
                height: "4320",
                actionIdentifier: "id-42"
            }]
        ])("should identify as Display when %s set as optional value", (_, display) => {
            // WHEN
            const typeGuardResult = isDisplay(display);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
import {Display, isDisplay} from "./display.interface";
import {Messages} from "./messages.interface";

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

        it("should not identify as Display when messages is not an object", () => {
            //GIVEN
            const display = {
                index: 1,
                messages: 42,
                url: "https://sakuli.io",
                width: "7680",
                height: "4320",
                actionIdentifier: "id-42"
            };

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
            ["messages", {
                index: 1,
                someCrazyProperty: 42,
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
            }],
            ["width", {
                index: 1,
                messages: {en: {description: "description", infoText: "info"}},
                url: "https://sakuli.io",
                someCrazyProperty: 42,
                height: "4320",
                actionIdentifier: "id-42"
            }],
            ["height", {
                index: 1,
                messages: {en: {description: "description", infoText: "info"}},
                url: "https://sakuli.io",
                width: "7680",
                someCrazyProperty: 42,
                actionIdentifier: "id-42"
            }],
            ["actionIdentifier", {
                index: 1,
                messages: {en: {description: "description", infoText: "info"}},
                url: "https://sakuli.io",
                width: "7680",
                height: "4320",
                someCrazyProperty: 42
            }]
        ])("should not identify as Display when %s is replaced with random field", (_, display) => {
            // WHEN
            const typeGuardResult = isDisplay(display);

            // THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should identify as Display when all fields are set correctly", () => {
            // GIVEN
            const messagesEn: Messages = {
                description: "description",
                infoText: "info"
            }
            const messagesDe: Messages = {
                description: "Beschreibung",
                infoText: "Information"
            }
            const display: Display = {
                index: 1,
                messages: {en: messagesEn, de: messagesDe},
                url: "https://sakuli.io",
                width: "7680",
                height: "4320",
                actionIdentifier: "id-42"
            };

            // WHEN
            const typeGuardResult = isDisplay(display);

            // THEN
            expect(typeGuardResult).toBeTruthy();
        });
    })
})
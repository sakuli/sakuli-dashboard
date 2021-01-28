import { validateDisplays } from "./validate-displays.function";
import { isDisplay } from "../interfaces";

jest.mock("../interfaces", () => ({
    isDisplay: jest.fn()
}));

describe("validate displays", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("should return false if displays are undefined", () => {
        // GIVEN
        const displays = undefined;

        // WHEN
        const validattionResult = validateDisplays(displays);

        // THEN
        expect(validattionResult).toBeFalsy();
    });

    it("should return false if displays is not an array", () => {
        // GIVEN
        const displays = {};

        // WHEN
        const validationResult = validateDisplays(displays);

        // THEN
        expect(validationResult).toBeFalsy();
    });

    it("should return false if a display is invalid", () => {
        // GIVEN
        const display = {
            actionIdentifier: "",
            index: 0,
            url: ""
        }
        const displays = [display];
        (isDisplay as unknown as jest.Mock).mockImplementation(() => false);

        // WHEN
        const validationResult = validateDisplays(displays);

        // THEN
        expect(isDisplay).toHaveBeenCalledTimes(1);
        expect(validationResult).toBeFalsy();
    });

    it("should return true if display is valid", () => {
        // GIVEN
        const display = {
            actionIdentifier: "",
            messages: {},
            index: 0,
            url: ""
        }
        const displays = [display];
        (isDisplay as unknown as jest.Mock).mockImplementation(() => true);

        // WHEN
        const validationResult = validateDisplays(displays);

        // THEN
        expect(isDisplay).toHaveBeenCalledTimes(1);
        expect(validationResult).toBeTruthy();
    });
})
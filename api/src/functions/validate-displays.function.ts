import { isDisplay } from "../interfaces";

export function validateDisplays(displays: any) {
    if (!displays || !Array.isArray(displays)) {
        return false;
    }
    for (let display of displays) {
        if (!isDisplay(display)) {
            return false;
        }
    }
    return true;
}
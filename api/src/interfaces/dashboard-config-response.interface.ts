import { Display, isLayoutMode, LayoutMode } from ".";
import { validateDisplays } from "../functions";

export interface DashboardConfigResponse {
    displays: Display[]
    defaultLayout?: LayoutMode
}

export function isDashboardConfigResponse(response: any): response is DashboardConfigResponse {
    if (!response) {
        return false;
    }

    if (Object.keys(response).length === 1) {
        return validateDisplays(response.displays);
    }

    if (Object.keys(response).length === 2) {
        return validateDisplays(response.displays) && isLayoutMode(response.defaultLayout);
    }

    return false;
}

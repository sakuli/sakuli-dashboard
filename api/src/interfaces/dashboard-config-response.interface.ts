import { Display, isDisplay, isLayoutMode, LayoutMode } from ".";

export interface DashboardConfigResponse {
    displays: Display[]
    defaultLayout?: LayoutMode
}

export function isDashboardConfigResponse(response: any): response is DashboardConfigResponse {
    function validateDisplays() {
        if (!response.displays || !Array.isArray(response.displays)) {
            return false;
        }
        for (let display of response.displays) {
            if (!isDisplay(display)) {
                return false;
            }
        }
        return true;
    }

    if (!response) {
        return false;
    }

    if (Object.keys(response).length === 1) {
        return validateDisplays();
    }

    if (Object.keys(response).length === 2) {
        return validateDisplays() && isLayoutMode(response.defaultLayout);
    }

    return false;
}

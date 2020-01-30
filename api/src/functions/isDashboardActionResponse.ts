import { BackendError, DashboardActionResponse } from "../interfaces";

export function isDashboardActionResponse(json: DashboardActionResponse | BackendError) : json is DashboardActionResponse {
    return !!((json as DashboardActionResponse).pollingInterval || (json as DashboardActionResponse).url);
}
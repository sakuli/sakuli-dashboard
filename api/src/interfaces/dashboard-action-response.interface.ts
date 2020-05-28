import { BackendError, DisplayUpdate } from ".";

export interface DashboardActionResponse extends DisplayUpdate{
}

export function isDashboardActionResponse(json: DashboardActionResponse | BackendError) : json is DashboardActionResponse {
  return !!((json as DashboardActionResponse).pollingInterval || (json as DashboardActionResponse).url);
}
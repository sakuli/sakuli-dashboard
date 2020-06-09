import { DisplayUpdate } from ".";

export interface DashboardActionResponse extends DisplayUpdate{
}

export function isDashboardActionResponse(json: any) : json is DashboardActionResponse {

  function containsDashboardActionResponseFields() {
    return !!((json as DashboardActionResponse).pollingInterval || (json as DashboardActionResponse).url);
  }
  function isEmptyObject() {
    return Object.keys(json).length === 0 && json.constructor === Object;
  }

  return containsDashboardActionResponseFields() || isEmptyObject();
}
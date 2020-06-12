import { isDashboardActionResponse } from "./dashboard-action-response.interface";

describe("dashboard action response", () => {
  describe("type guard", () => {
    it("should identify dashboard response due to pollingInterval", () => {

      //GIVEN
      const dashboardActionResponse = {pollingInterval: 42}

      //WHEN
      const typeGuardResult = isDashboardActionResponse(dashboardActionResponse);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    })

    it("should identify dashboard response due to url", () => {

      //GIVEN
      const dashboardActionResponse = {url: "https://svettwer.github.io"}

      //WHEN
      const typeGuardResult = isDashboardActionResponse(dashboardActionResponse);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    })

    it("should identify empty object as dashboard response", () => {

      //GIVEN
      const dashboardActionResponse = {}

      //WHEN
      const typeGuardResult = isDashboardActionResponse(dashboardActionResponse);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    })

    it("should identify object other than dashboard response", () => {

      //GIVEN
      const dashboardActionResponse = {someCrazyProperty: 42}

      //WHEN
      const typeGuardResult = isDashboardActionResponse(dashboardActionResponse);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    })
  })
})
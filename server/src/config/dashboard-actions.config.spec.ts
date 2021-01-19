import {
  isClusterAction,
  isDashboardActionsConfig
} from "./dashboard-actions.config";

describe("dashboard action config", () => {
  describe("dashboardActionsConfig type guard", () => {
    it("should not identify as dashboardActionsConfig when empty", () => {
      // GIVEN
      const dashboardActionsConfig = {};

      // WHEN
      const typeGuardResult = isDashboardActionsConfig(dashboardActionsConfig);

      // THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as dashboardActionsConfig when random field is set", () => {
      // GIVEN
      const dashboardActionsConfig = {
        someCrazyProperty: 42
      };

      // WHEN
      const typeGuardResult = isDashboardActionsConfig(dashboardActionsConfig);

      // THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as dashboardActionsConfig when set correctly", () => {
      // GIVEN
      const dashboardActionsConfig = {
        actions: [{}]
      };

      // WHEN
      const typeGuardResult = isDashboardActionsConfig(dashboardActionsConfig);

      // THEN
      expect(typeGuardResult).toBeTruthy();
    });
  });

  describe("clusterAction type guard", () => {
    it("should not identify as clusterAction when empty", () => {
      //GIVEN
      const action = {}

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as clusterAction when random field is added to mandatory fields", () => {
      //GIVEN
      const action = {
        action: { kind: "pod" },
        someCrazyProperty: 42
      }

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as clusterAction when random field is added to all fields", () => {
      //GIVEN
      const action = {
        action: { kind: "pod" },
        actionIdentifier: "id",
        someCrazyProperty: 42
      }

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should identify as clusterAction when only mandatory fields are set", () => {
      //GIVEN
      const action = {
        action: { kind: "pod" },
        actionIdentifier: "id",
      }

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    });

    it("should identify as clusterAction when all fields are set", () => {
      //GIVEN
      const action = {
        action: { kind: "pod" },
        actionIdentifier: "id",
        displayUpdate: { url: "https://sakuli.io" }
      }

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    });
  })
})
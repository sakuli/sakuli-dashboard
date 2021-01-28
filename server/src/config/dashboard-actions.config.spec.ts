import { isClusterAction, isDashboardActionsConfig } from "./dashboard-actions.config";

describe("dashboard action config", () => {
  describe("dashboardActionsConfig type guard", () => {
    it("should not identify as dashboardActionsConfig when undefined", () => {
      // GIVEN
      const dashboardActionsConfig = undefined;

      // WHEN
      const typeGuardResult = isDashboardActionsConfig(dashboardActionsConfig);

      // THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as dashboardActionsConfig when empty", () => {
      // GIVEN
      const dashboardActionsConfig = {};

      // WHEN
      const typeGuardResult = isDashboardActionsConfig(dashboardActionsConfig);

      // THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as dashboardActionsConfig when random field is set instead of actions", () => {
      // GIVEN
      const dashboardActionsConfig = {
        someCrazyProperty: 42
      };

      // WHEN
      const typeGuardResult = isDashboardActionsConfig(dashboardActionsConfig);

      // THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as dashboardActionsConfig when actions is set with different type", () => {
      // GIVEN
      const dashboardActionsConfig = {
        actions: 42
      };

      // WHEN
      const typeGuardResult = isDashboardActionsConfig(dashboardActionsConfig);

      // THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should identify as dashboardActionsConfig when set correctly", () => {
      // GIVEN
      const dashboardActionsConfig = {
        actions: [{actionIdentifier: "id-42", action: {}}]
      };

      // WHEN
      const typeGuardResult = isDashboardActionsConfig(dashboardActionsConfig);

      // THEN
      expect(typeGuardResult).toBeTruthy();
    });
  });

  describe("clusterAction type guard", () => {
    it("should not identify as clusterAction when undefined", () => {
      //GIVEN
      const action = undefined;

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as clusterAction when empty", () => {
      //GIVEN
      const action = {}

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it.each([
      ["action", "only mandatory", {someCrazyProperty: 42, actionIdentifier: "id-42"}],
      ["actionIdentifier", "only mandatory", {action: {}, someCrazyProperty: 42}],
      ["action", "all fields", {someCrazyProperty: 42, actionIdentifier: "id-42", displayUpdate: {}}],
      ["actionIdentifier", "all fields", {action: {}, someCrazyProperty: 42, displayUpdate: {}}],
      ["displayUpdate", "all fields", {action: {}, actionIdentifier: "id-42", someCrazyProperty: 42}]
    ])("should not identify as clusterAction when random field is instead of %s with %s set", (_, __, action) => {
      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it.each([
      ["action", "only mandatory", {action: 42, actionIdentifier: "id-42"}],
      ["actionIdentifier", "only mandatory", {action: {}, actionIdentifier: 42}],
      ["action", "all fields", {action: 42, actionIdentifier: "id-42", displayUpdate: {}}],
      ["actionIdentifier", "all fields", {action: {}, actionIdentifier: 42, displayUpdate: {}}],
      ["displayUpdate", "all fields", {action: {}, actionIdentifier: "id-42", displayUpdate: 42}]
    ])("should not identify as clusterAction when %s is set with different type with %s", (_, __, action) => {
      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should identify as clusterAction when only mandatory fields are set", () => {
      //GIVEN
      const action = {
        action: {},
        actionIdentifier: "id-42",
      }

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    });

    it("should identify as clusterAction when all fields are set", () => {
      //GIVEN
      const action = {
        action: {},
        actionIdentifier: "id-42",
        displayUpdate: {url: "https://sakuli.io"}
      }

      //WHEN
      const typeGuardResult = isClusterAction(action);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    });
  })
})
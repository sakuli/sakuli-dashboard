import { isCronjobConfig } from "./cronjob.config";

describe("cronjob config", () => {
  describe("type guard", () => {
    it("should not identify as cronjobConfig when undefined", () => {
      //GIVEN
      const cronjob = undefined

      //WHEN
      const typeGuardResult = isCronjobConfig(cronjob);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as cronjobConfig when empty", () => {
      //GIVEN
      const cronjob = {}

      //WHEN
      const typeGuardResult = isCronjobConfig(cronjob);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it.each([
      ["schedule", {someCrazyProperty: 42, actionIdentifier: "id-42"}],
      ["actionIdentifier", {schedule: "* * * * * *", someCrazyProperty: 42}]
    ])("should not identify as cronjobConfig when random field is set instead of %s", (_, cronjob) => {
      //WHEN
      const typeGuardResult = isCronjobConfig(cronjob);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it.each([
      ["schedule", {schedule: 42, actionIdentifier: "id-42"}],
      ["actionIdentifier", {schedule: "* * * * * *", actionIdentifier: 42}]
    ])("should not identify as cronjobConfig when %s is set with different type", (_, cronjob) => {
      //WHEN
      const typeGuardResult = isCronjobConfig(cronjob);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should identify as cronjobConfig when all fields are set", () => {
      //GIVEN
      const cronjob = {
        schedule: "* * * * * *",
        actionIdentifier: "id-42"
      }

      //WHEN
      const typeGuardResult = isCronjobConfig(cronjob);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    });
  })
})
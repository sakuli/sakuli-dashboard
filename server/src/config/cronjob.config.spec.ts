import { isCronjobConfig } from "./cronjob.config";

describe("cronjob config", () => {
  describe("type guard", () => {
    it("should not identify as cronjobConfig when empty", () => {
      //GIVEN
      const cronjob = {}

      //WHEN
      const typeGuardResult = isCronjobConfig(cronjob);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as cronjobConfig when random field is set", () => {
      //GIVEN
      const cronjob = {
        actionIdentifier: "id",
        someCrazyProperty: 42
      }

      //WHEN
      const typeGuardResult = isCronjobConfig(cronjob);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should identify as cronjobConfig when all fields are set", () => {
      //GIVEN
      const cronjob = {
        schedule: "* * * * * *",
        actionIdentifier: "id"
      }

      //WHEN
      const typeGuardResult = isCronjobConfig(cronjob);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    });
  })
})
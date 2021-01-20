import { isK8sClusterConfig } from "./k8s-cluster.config";

describe("k8s cluster config", () => {
  describe("type guard", () => {
    it("should not identify as K8sClusterConfig when empty", () => {
      //GIVEN
      const k8sClusterConfig = {};

      //WHEN
      const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as K8sClusterConfig when mandatory cluster-field is missing", () => {
      //GIVEN
      const k8sClusterConfig = {
        namespace: "dashboard",
        user: {
          name: "sören sakuli"
        }
      };

      //WHEN
      const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as K8sClusterConfig when mandatory user-field is missing", () => {
      //GIVEN
      const k8sClusterConfig = {
        namespace: "dashboard",
        cluster: {
          name: "my cluster",
          server: "https://my-cluster.foo",
          skipTLSVerify: false
        }
      };

      //WHEN
      const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as K8sClusterConfig when mandatory namespace-field is missing", () => {
      //GIVEN
      const k8sClusterConfig = {
        user: {
          name: "sören sakuli"
        },
        cluster: {
          name: "my cluster",
          server: "https://my-cluster.foo",
          skipTLSVerify: false
        }
      };

      //WHEN
      const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should not identify as K8sClusterConfig when random field is added instead of cluster", () => {
      //GIVEN
      const k8sClusterConfig = {
        namespace: "dashboard",
        user: {
          name: "sören sakuli"
        },
        someCrazyProperty: 42
      };

      //WHEN
      const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

      //THEN
      expect(typeGuardResult).toBeFalsy();
    });

    it("should identify as K8sClusterConfig when all fields are set", () => {
      //GIVEN
      const k8sClusterConfig = {
        namespace: "dashboard",
        user: {
          name: "sören sakuli"
        },
        cluster: {
          name: "my cluster",
          server: "https://my-cluster.foo",
          skipTLSVerify: false
        }
      };

      //WHEN
      const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

      //THEN
      expect(typeGuardResult).toBeTruthy();
    });
  })
})
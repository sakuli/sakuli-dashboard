import { isK8sClusterConfig } from "./k8s-cluster.config";

describe("k8s cluster config", () => {
    describe("type guard", () => {
        it("should not identify as K8sClusterConfig when undefined", () => {
            //GIVEN
            const k8sClusterConfig = undefined;

            //WHEN
            const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

            //THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it("should not identify as K8sClusterConfig when empty", () => {
            //GIVEN
            const k8sClusterConfig = {};

            //WHEN
            const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

            //THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["user", {
                someCrazyProperty: 42,
                cluster: {
                    name: "my cluster",
                    server: "https://my-cluster.foo",
                    skipTLSVerify: false
                },
                namespace: "dashboard"
            }],
            ["cluster", {
                user: {
                    name: "sören sakuli"
                },
                someCrazyProperty: 42,
                namespace: "dashboard"
            }],
            ["namespace", {
                user: {
                    name: "sören sakuli"
                },
                cluster: {
                    name: "my cluster",
                    server: "https://my-cluster.foo",
                    skipTLSVerify: false
                },
                someCrazyProperty: 42
            }]
        ])("should not identify as K8sClusterConfig when random field is set as %s", (_, k8sClusterConfig) => {
            //WHEN
            const typeGuardResult = isK8sClusterConfig(k8sClusterConfig);

            //THEN
            expect(typeGuardResult).toBeFalsy();
        });

        it.each([
            ["user", {
                user: 42,
                cluster: {
                    name: "my cluster",
                    server: "https://my-cluster.foo",
                    skipTLSVerify: false
                },
                namespace: "dashboard"
            }],
            ["cluster", {
                user: {
                    name: "sören sakuli"
                },
                cluster: 42,
                namespace: "dashboard"
            }],
            ["namespace", {
                user: {
                    name: "sören sakuli"
                },
                cluster: {
                    name: "my cluster",
                    server: "https://my-cluster.foo",
                    skipTLSVerify: false
                },
                namespace: 42
            }]
        ])("should not identify as K8sClusterConfig when a different type is set for %s", (_, k8sClusterConfig) => {
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
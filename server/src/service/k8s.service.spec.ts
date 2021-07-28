

jest.mock("../functions/get-configuration.function")
jest.mock("@kubernetes/client-node")

import { mockPartial } from "sneer";
import { Configuration, getConfiguration } from "../functions/get-configuration.function";
import { CoreV1Api, KubeConfig, V1Pod, V1Status } from "@kubernetes/client-node";
import * as http from "http";
import { V1ObjectMeta } from "@kubernetes/client-node/dist/gen/model/v1ObjectMeta";
import { K8sClusterConfig } from "../config/k8s-cluster.config";
import { apply, deletePod, getPodStatus } from "./k8s.service";

describe("k8s service", () => {

    const KubeConfigMock = KubeConfig as any as jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })

    const getConfigurationMock = getConfiguration as any as jest.Mock<Configuration>

    describe("apply pod config", () => {

        const podToCreate = mockPartial<V1Pod>({
            metadata: mockPartial<V1ObjectMeta>({
                name: "Sachuli"
            })
        });

        it("should throw if no cluster config is set", async () => {

            //GIVEN
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({})
            });
            const expectedRejection = { message: "Could not apply pod config to cluster: Cluster config is not defined." }

            //WHEN
            await expect(apply(mockPartial<V1Pod>({})))
                //THEN
                .rejects.toEqual(expectedRejection)

        })

        it("should create pod", async () => {

            //GIVEN
            const expectedResponse = mockPartial<{response: http.IncomingMessage; body: V1Pod}>({
                body: mockPartial<V1Pod>({}),
                response: mockPartial<http.IncomingMessage>(
                    {statusCode: 201}
                )
            })

            const createNamespacePodMock = jest.fn().mockImplementation(async (): Promise<{
                response: http.IncomingMessage;
                body: V1Pod;
            }> => {
                return expectedResponse
            })

            KubeConfigMock.mockImplementation(() => {
                return mockPartial({
                    loadFromClusterAndUser: jest.fn(),
                    makeApiClient: () => mockPartial<CoreV1Api>({
                        createNamespacedPod: createNamespacePodMock,
                    })
                })
            })

            const clusterConfig = mockPartial<K8sClusterConfig>({
                namespace: "foobar"
            })
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: clusterConfig
                })
            });

            //WHEN
            const applyPromise = apply(podToCreate);

            //THEN
            await expect(applyPromise).resolves.toEqual(expectedResponse);
            expect(createNamespacePodMock).toBeCalledWith(clusterConfig.namespace, podToCreate)
        })

        it("should reject if pod could not be applied", async () => {

            //GIVEN
            KubeConfigMock.mockImplementation(() => {
                return mockPartial({
                    loadFromClusterAndUser: jest.fn(),
                    makeApiClient: () => mockPartial<CoreV1Api>({
                        createNamespacedPod: jest.fn().mockRejectedValue("Cluster said no!"),
                    })
                })
            })

            const clusterConfig = mockPartial<K8sClusterConfig>({
                namespace: "foobar"
            })
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: clusterConfig
                })
            });

            const expectedRejection = { message: "Could not apply pod configuration on cluster" }

            //WHEN
            const applyPromise = apply(podToCreate);

            //THEN
            await expect(applyPromise).rejects.toEqual(expectedRejection)
        })
    })

    describe("get pod status", () => {

        it("should throw if no cluster config is set", async () => {

            //GIVEN
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({})
            });
            const expectedRejection = { message: "Could not apply get pod status: Cluster config is not defined." }

            //WHEN
            await expect(getPodStatus(mockPartial<V1Pod>({})))
                //THEN
                .rejects.toEqual(expectedRejection)

        })

        it("should throw if pod name is not specified", async () => {

            //GIVEN
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: mockPartial<K8sClusterConfig>({
                        namespace: "foobar"
                    })
                })
            });
            const expectedRejection = { message: "Could not get pod status due to missing name" }

            const podToCheck = mockPartial<V1Pod>({
                metadata: mockPartial<V1ObjectMeta>({})
            });

            //WHEN
            await expect(getPodStatus(podToCheck))
                //THEN
                .rejects.toEqual(expectedRejection)
        })

        it("should get pod status", async () => {

            //GIVEN
            const namespace = "foobar";
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: mockPartial<K8sClusterConfig>({
                        namespace: namespace
                    })
                })
            });

            const podName = "The real slim Sakuli"
            const podToCheck = mockPartial<V1Pod>({
                metadata: mockPartial<V1ObjectMeta>({
                    name: podName
                })
            });

            const expectedPodStatus = mockPartial({
                status: mockPartial<V1Status>({
                    status: "Running"
                })
            })
            const readNamespacedPodStatus = jest.fn().mockResolvedValue(mockPartial({
                response: mockPartial<http.IncomingMessage>({}),
                body: expectedPodStatus
            }))
            KubeConfigMock.mockImplementation(() => {
                return mockPartial({
                    loadFromClusterAndUser: jest.fn(),
                    makeApiClient: () => mockPartial<CoreV1Api>({
                        readNamespacedPodStatus: readNamespacedPodStatus
                    })
                })
            })

            //WHEN
            const podStatusPromise = getPodStatus(podToCheck);

            //THEN
            await expect(podStatusPromise).resolves.toEqual(expectedPodStatus)
            expect(readNamespacedPodStatus).toBeCalledWith(podName, namespace)
        })

        it("should reject if pod status cannot determined", async () => {
            //GIVEN
            const namespace = "foobar";
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: mockPartial<K8sClusterConfig>({
                        namespace: namespace
                    })
                })
            });

            const podName = "The real slim Sakuli"
            const podToCheck = mockPartial<V1Pod>({
                metadata: mockPartial<V1ObjectMeta>({
                    name: podName
                })
            });

            KubeConfigMock.mockImplementation(() => {
                return mockPartial({
                    loadFromClusterAndUser: jest.fn(),
                    makeApiClient: () => mockPartial<CoreV1Api>({
                        readNamespacedPodStatus: jest.fn()
                            .mockRejectedValue(
                                "The vms are sweaty, nodes weak, pods are heavy, " +
                                "turned on the throttle already, network spaghetti...")
                    })
                })
            })

            const expectedRejection = { message: "Could not get pod status from cluster." }

            //WHEN
            const podStatusPromise = getPodStatus(podToCheck);

            //THEN
            await expect(podStatusPromise).rejects.toEqual(expectedRejection)
        })

        it("should return undefined, if pod does not exist", async () => {
            //GIVEN
            const namespace = "foobar";
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: mockPartial<K8sClusterConfig>({
                        namespace: namespace
                    })
                })
            });

            const podName = "The real slim Sakuli"
            const podToCheck = mockPartial<V1Pod>({
                metadata: mockPartial<V1ObjectMeta>({
                    name: podName
                })
            });

            KubeConfigMock.mockImplementation(() => {
                return mockPartial({
                    loadFromClusterAndUser: jest.fn(),
                    makeApiClient: () => mockPartial<CoreV1Api>({
                        readNamespacedPodStatus: jest.fn()
                            .mockRejectedValue({
                                "response":
                                    {
                                        "statusCode": 404,
                                    },
                                "body": {
                                    "apiVersion":"v1",
                                    "kind":"Status",
                                    "metadata":{},
                                    "status":{}
                                }
                            })
                    })
                })
            })

            //WHEN
            const podStatusPromise = getPodStatus(podToCheck);

            //THEN
            await expect(podStatusPromise).resolves.toBeUndefined();
        })
    })

    describe("delete pod", () => {

        it("should throw if no cluster config is set", async () => {

            //GIVEN
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({})
            });
            const expectedRejection = { message: "Could not delete pod: Cluster config is not defined." }

            //WHEN
            await expect(deletePod(mockPartial<V1Pod>({})))
                //THEN
                .rejects.toEqual(expectedRejection)

        })

        it("should throw if pod name is not specified", async () => {

            //GIVEN
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: mockPartial<K8sClusterConfig>({
                        namespace: "foobar"
                    })
                })
            });
            const expectedRejection = { message: "Could not delete pod due to missing name" }

            const podToCheck = mockPartial<V1Pod>({
                metadata: mockPartial<V1ObjectMeta>({})
            });

            //WHEN
            await expect(deletePod(podToCheck))
                //THEN
                .rejects.toEqual(expectedRejection)
        })

        it("should delete pod", async () => {

            //GIVEN
            const namespace = "foobar";
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: mockPartial<K8sClusterConfig>({
                        namespace: namespace
                    })
                })
            });

            const podName = "Jon Sakuli"
            const podToDelete = mockPartial<V1Pod>({
                metadata: mockPartial<V1ObjectMeta>({
                    name: podName
                })
            });

            const deleteNamespacedPodMock = jest.fn()
            KubeConfigMock.mockImplementation(() => {
                return mockPartial({
                    loadFromClusterAndUser: jest.fn(),
                    makeApiClient: () => mockPartial<CoreV1Api>({
                        deleteNamespacedPod: deleteNamespacedPodMock
                    })
                })
            })

            //WHEN
            const podStatusPromise = deletePod(podToDelete);

            //THEN
            await expect(podStatusPromise).resolves.not.toThrow()
            expect(deleteNamespacedPodMock).toBeCalledWith(podName, namespace)
        })

        it("should reject if pod cannot be deleted", async () => {

            //GIVEN
            const namespace = "foobar";
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({
                    k8sClusterConfig: mockPartial<K8sClusterConfig>({
                        namespace: namespace
                    })
                })
            });

            const podName = "Jon Sakuli"
            const podToDelete = mockPartial<V1Pod>({
                metadata: mockPartial<V1ObjectMeta>({
                    name: podName
                })
            });

            KubeConfigMock.mockImplementation(() => {
                return mockPartial({
                    loadFromClusterAndUser: jest.fn(),
                    makeApiClient: () => mockPartial<CoreV1Api>({
                        deleteNamespacedPod: jest.fn().mockRejectedValue("Winter is coming")
                    })
                })
            })
            const expectedRejection = {message: "Could not delete pod on cluster"}

            //WHEN
            const podStatusPromise = deletePod(podToDelete);

            //THEN
            await expect(podStatusPromise).rejects.toEqual(expectedRejection)
        })
    })
})

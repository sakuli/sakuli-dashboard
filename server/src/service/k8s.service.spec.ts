jest.mock("../functions/get-configuration.function")
jest.mock("@kubernetes/client-node")

import { mockPartial } from "sneer";
import { Configuration, getConfiguration } from "../functions/get-configuration.function";
import { CoreV1Api, KubeConfig, V1Pod } from "@kubernetes/client-node";
import * as http from "http";
import { V1ObjectMeta } from "@kubernetes/client-node/dist/gen/model/v1ObjectMeta";
import { K8sClusterConfig } from "../config/k8s-cluster.config";
import { apply } from "./k8s.service";

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
            const expectedRejection = { message: "Could apply pod config to cluster: Cluster config is not defined." }

            //WHEN
            await expect(apply(mockPartial<V1Pod>({})))
                //THEN
                .rejects.toEqual(expectedRejection)

        })

        it("should create pod", async () => {

            //GIVEN
            const expectedResponse = mockPartial<http.IncomingMessage>({
                statusCode: 201
            })

            const createNamespacePodMock = jest.fn().mockImplementation(async (): Promise<{
                response: http.IncomingMessage;
                body: V1Pod;
            }> => {
                return {
                    response: expectedResponse,
                    body: mockPartial<V1Pod>({})
                }
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

            //WHEN
            const applyPromise = apply(podToCreate);

            //THEN
            await expect(applyPromise).rejects.toEqual(
                {
                    message: "Could not apply pod configuration on cluster"
                })
        })
    })
})
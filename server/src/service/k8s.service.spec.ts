jest.mock("../functions/get-configuration.function")
jest.mock("@kubernetes/client-node")

import { mockPartial } from "sneer";
import { Configuration, getConfiguration } from "../functions/get-configuration.function";
import { V1Pod } from "@kubernetes/client-node";
import * as K8sService from "./k8s.service";

describe("k8s service", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    })

    const getConfigurationMock = getConfiguration as any as jest.Mock<Configuration>

    describe("apply pod config", () => {
        it("should throw if no cluster config is set", async () => {

            //GIVEN
            getConfigurationMock.mockImplementation(() => {
                return mockPartial<Configuration>({})
            });
            const expectedRejection = { message: "Could apply pod config to cluster: Cluster config is not defined." }

            //WHEN
            await expect(K8sService.apply(mockPartial<V1Pod>({})))
                //THEN
                .rejects.toEqual(expectedRejection)

        })
    })
})
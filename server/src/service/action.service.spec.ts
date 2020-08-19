jest.mock("../functions/get-configuration.function")
jest.mock("./k8s.service")
import * as GetConfig from "../functions/get-configuration.function"
import { Configuration } from "../functions/get-configuration.function"
import { executeAction } from "./action.service";
import { mockPartial } from "sneer";
import { V1Pod } from "@kubernetes/client-node";
import { k8sService } from "./k8s.service";
import { V1ObjectMeta } from "@kubernetes/client-node/dist/gen/model/v1ObjectMeta";

describe("action service", () =>{

    beforeEach(() =>{
        jest.resetAllMocks()
    })

    const dashboardActionRequest = {
        actionIdentifier: "7890eab9-6c5e-4e40-b39c-163900ea4834"
    }

    it("should reject in case action config is undefined", () => {

        //GIVEN
        mockGetConfig(mockPartial<Configuration>({}));
        const expectedRejection = { message: "No actions configured." }

        //WHEN
        return expect(executeAction(dashboardActionRequest))
            //THEN
            .rejects.toEqual(expectedRejection)
    })

    it("should reject in case of an unknown action", async () => {

        //GIVEN
        const mockedConfig = mockPartial<Configuration>({
            actionConfig: {
                actions: [
                    {
                        actionIdentifier: "42",
                        action: mockPartial<V1Pod>({
                            metadata: mockPartial<V1ObjectMeta>({})
                        })
                    }
                ]
            }
        })

        mockGetConfig(mockedConfig);
        const expectedRejection = {message: `Requested action '${dashboardActionRequest.actionIdentifier}' not found.`}

        //WHEN
        await expect(executeAction(dashboardActionRequest))
            //THEN
            .rejects.toEqual(expectedRejection)
    })

    it("should not delete pod if pod is still alive", async () => {


        //GIVEN
        const expectedDisplayUpdate =  {
            url:"google.de",
            pollingInterval: 200
        };
        const mockedConfig = mockPartial<Configuration>({
            actionConfig: {
                actions: [
                    {
                        actionIdentifier: "7890eab9-6c5e-4e40-b39c-163900ea4834",
                        action: mockPartial<V1Pod>({
                            metadata: mockPartial<V1ObjectMeta>({})
                        }),
                        displayUpdate: expectedDisplayUpdate
                    }
                ]
            }
        })
        mockGetConfig(mockedConfig);

        //WHEN
        const displayUpdate = executeAction(dashboardActionRequest);

        //THEN
        expect(k8sService().deletePod).not.toBeCalled()
        await expect(displayUpdate).resolves.toEqual(expectedDisplayUpdate)
    })

    function mockGetConfig(config: Configuration) {
        const getConfigSpy = jest.spyOn(GetConfig, "getConfiguration");
        getConfigSpy.mockImplementation(() => {
            return mockPartial<Configuration>({
                ...config
            })
        })
    }
})
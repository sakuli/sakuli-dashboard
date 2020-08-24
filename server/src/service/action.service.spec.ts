jest.mock("../functions/get-configuration.function")
jest.mock("./k8s.service")
import { Configuration, getConfiguration } from "../functions/get-configuration.function"
import { executeAction } from "./action.service";
import { mockPartial } from "sneer";
import { V1Pod } from "@kubernetes/client-node";
import { V1ObjectMeta } from "@kubernetes/client-node/dist/gen/model/v1ObjectMeta";
import http from "http";
import { apply, deletePod, getPodStatus } from "./k8s.service";

describe("action service", () =>{

    beforeEach(() =>{
        jest.resetAllMocks()
    })

    const getConfigurationMock = getConfiguration as any as jest.Mock<Configuration>
    const podStatusMock = getPodStatus as any as jest.Mock<Promise<V1Pod>>
    const applyMock = apply as any as jest.Mock<Promise<http.IncomingMessage>>

    const dashboardActionRequest = {
        actionIdentifier: "7890eab9-6c5e-4e40-b39c-163900ea4834"
    }

    it("should reject in case action config is undefined", async () => {

        //GIVEN
        getConfigurationMock.mockImplementation(() => {
            return mockPartial<Configuration>({})
        });
        const expectedRejection = { message: "No actions configured." }

        //WHEN
        await expect(executeAction(dashboardActionRequest))
            //THEN
            .rejects.toEqual(expectedRejection)
    })

    it("should reject in case of an unknown action", async () => {

        //GIVEN
        getConfigurationMock.mockImplementation(() =>  {
            return mockPartial<Configuration>({
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
        })

        const expectedRejection = {message: `Requested action '${dashboardActionRequest.actionIdentifier}' not found.`}

        //WHEN
        await expect(executeAction(dashboardActionRequest))
            //THEN
            .rejects.toEqual(expectedRejection)
    })

    it("should not delete pod if it is still alive", async () => {

        //GIVEN
        const expectedDisplayUpdate =  {
            url:"google.de",
            pollingInterval: 200
        };
        getConfigurationMock.mockImplementation(() =>  {
            return mockPartial<Configuration>({
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
        })

        podStatusMock.mockImplementation((_: V1Pod) => {
            return Promise.resolve(mockPartial<V1Pod>({
                status: {
                    phase: "Running"
                }
            }))
        })

        //WHEN
        const displayUpdate = executeAction(dashboardActionRequest);

        //THEN
        await expect(displayUpdate).resolves.toEqual(expectedDisplayUpdate)
        expect(deletePod).not.toBeCalled()
    })

    it("should return empty object if no display update is specified", async () => {

        //GIVEN
        getConfigurationMock.mockImplementation(() =>  {
            return mockPartial<Configuration>({
                actionConfig: {
                    actions: [
                        {
                            actionIdentifier: "7890eab9-6c5e-4e40-b39c-163900ea4834",
                            action: mockPartial<V1Pod>({
                                metadata: mockPartial<V1ObjectMeta>({})
                            })
                        }
                    ]
                }
            })
        })

        podStatusMock.mockImplementation((_: V1Pod) => {
            return Promise.resolve(mockPartial<V1Pod>({
                status: {
                    phase: "Running"
                }
            }))
        })

        const expectedDisplayUpdate = {}

        //WHEN
        const displayUpdate = executeAction(dashboardActionRequest);

        //THEN
        await expect(displayUpdate).resolves.toEqual(expectedDisplayUpdate)
        expect(deletePod).not.toBeCalled()
    })

    it("should apply action", async () => {

        //GIVEN
        const actionToPerform = mockPartial<V1Pod>({
            metadata: mockPartial<V1ObjectMeta>({
                name: "ConfidentialPod"
            })
        });
        const expectedDisplayUpdate = {
            url: "xhamster.com"
        }
        getConfigurationMock.mockImplementation(() =>  {
            return mockPartial<Configuration>({
                actionConfig: {
                    actions: [
                        {
                            actionIdentifier: "7890eab9-6c5e-4e40-b39c-163900ea4834",
                            action: actionToPerform,
                            displayUpdate: expectedDisplayUpdate
                        }
                    ]
                }
            })
        })

        podStatusMock.mockImplementation((_: V1Pod) => {
            return Promise.resolve(mockPartial<V1Pod>({
                status: {
                    phase: "Terminated"
                }
            }))
        })

        applyMock.mockImplementation((_: V1Pod) => {
            return Promise.resolve(mockPartial<http.IncomingMessage>({
                statusCode: 201
            }))
        })

        //WHEN
        const displayUpdate = executeAction(dashboardActionRequest);


        //THEN
        await expect(displayUpdate).resolves.toEqual(expectedDisplayUpdate)
        expect(deletePod).toBeCalledWith(actionToPerform)
        expect(apply).toBeCalledWith(actionToPerform)
    })
})
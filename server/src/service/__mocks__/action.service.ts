import { DashboardActionRequest, DisplayUpdate } from "../../../../api";

export const executeAction = jest.fn(
    async (dashboardAction: DashboardActionRequest): Promise<DisplayUpdate> => {
        return Promise.resolve({
            url: "foobar.com",
            pollingInterval: 200
        });
    })
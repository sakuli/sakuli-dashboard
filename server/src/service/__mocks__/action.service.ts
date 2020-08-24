import { DashboardActionRequest, DisplayUpdate } from "@sakuli-dashboard/api";

export const executeAction = jest.fn(
    async (dashboardAction: DashboardActionRequest): Promise<DisplayUpdate> => {
        return Promise.resolve({
            url: "foobar.com",
            pollingInterval: 200
        });
    })

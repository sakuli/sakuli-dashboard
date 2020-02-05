import { getConfiguration } from "./get-configuration.function";

describe('getConfiguration', () => {

    test.each([
        [
            "DASHBOARD_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.DASHBOARD_ACTION_CONFIG = "{}"
        ],
        [
            "CLUSTER_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "",
            () => process.env.DASHBOARD_ACTION_CONFIG = "{}"
        ],
        [
            "DASHBOARD_ACTION_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.DASHBOARD_ACTION_CONFIG = ""
        ]
    ])("should throw if %s is not set",
        (emptyVariable, setDashboardConfig, setClusterConfig, setDashboardActionConfig) => {
        //GIVEN
        setDashboardConfig();
        setClusterConfig();
        setDashboardActionConfig();

        //WHEN
        expect(getConfiguration)
            //THEN
            .toThrow(`Invalid configuration: Environment ${emptyVariable} is empty or undefined.`)
    });

    test.each([
        [
            "DASHBOARD_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{wrong}",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.DASHBOARD_ACTION_CONFIG = "{}"
        ],
        [
            "CLUSTER_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "{wrong}",
            () => process.env.DASHBOARD_ACTION_CONFIG = "{}"
        ],
        [
            "DASHBOARD_ACTION_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.DASHBOARD_ACTION_CONFIG = "{wrong}"]
    ])("should throw if %s is invalid",
        (invalidVariable, setDashboardConfig, setClusterConfig, setDashboardActionConfig) => {
            //GIVEN
            setDashboardConfig();
            setClusterConfig();
            setDashboardActionConfig();

            //WHEN
            expect(getConfiguration)
                //THEN
                .toThrow(`Invalid configuration: Could not parse environment variable ${invalidVariable}.`)
        });

    it("should parse and store config", () =>{

        //GIVEN
        const expectedDashboardConfig = {dashboard: "config"};
        const expectedClusterConfig = {cluster: "config"};
        const expectedDashboardActionConfig = {action: "config"};

        process.env.DASHBOARD_CONFIG = '{"dashboard": "config"}';
        process.env.CLUSTER_CONFIG = '{"cluster": "config"}';
        process.env.DASHBOARD_ACTION_CONFIG = '{"action": "config"}';

        //WHEN
        const configuration = getConfiguration();

        //THEN
        expect(configuration).toEqual({
            dashboardConfig: expectedDashboardConfig,
            actionConfig: expectedDashboardActionConfig,
            k8sClusterConfig: expectedClusterConfig
        });
    });
});
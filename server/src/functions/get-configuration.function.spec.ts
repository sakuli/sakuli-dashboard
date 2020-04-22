import { getConfiguration } from "./get-configuration.function";

describe('getConfiguration', () => {

    test.each([
        [
            "DASHBOARD_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.ACTION_CONFIG = "{}",
            () => process.env.CRONJOB_CONFIG = "{}"
        ],
        [
            "CLUSTER_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "",
            () => process.env.ACTION_CONFIG = "{}",
            () => process.env.CRONJOB_CONFIG = "{}"
        ],
        [
            "ACTION_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.ACTION_CONFIG = "",
            () => process.env.CRONJOB_CONFIG = "{}"
        ],
        [
            "CRONJOB_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.ACTION_CONFIG = "{}",
            () => process.env.CRONJOB_CONFIG = ""
        ]
    ])("should throw if %s is not set",
        (emptyVariable, setDashboardConfig, setClusterConfig, setDashboardActionConfig, setCronjob) => {
        //GIVEN
        setDashboardConfig();
        setClusterConfig();
        setDashboardActionConfig();
        setCronjob();

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
            () => process.env.ACTION_CONFIG = "{}",
            () => process.env.CRONJOB_CONFIG = "{}"
        ],
        [
            "CLUSTER_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "{wrong}",
            () => process.env.ACTION_CONFIG = "{}",
            () => process.env.CRONJOB_CONFIG = "{}"
        ],
        [
            "ACTION_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.ACTION_CONFIG = "{wrong}",
            () => process.env.CRONJOB_CONFIG = "{}"
        ],
        [
            "CRONJOB_CONFIG",
            () => process.env.DASHBOARD_CONFIG = "{}",
            () => process.env.CLUSTER_CONFIG = "{}",
            () => process.env.ACTION_CONFIG = "{}",
            () => process.env.CRONJOB_CONFIG = "{wrong}"
        ]
    ])("should throw if %s is invalid",
        (invalidVariable, setDashboardConfig, setClusterConfig, setDashboardActionConfig, setCronjobConfig) => {
            //GIVEN
            setDashboardConfig();
            setClusterConfig();
            setDashboardActionConfig();
            setCronjobConfig();

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
        const expectedCronjobConfig= {cronjob: "config"};

        process.env.DASHBOARD_CONFIG = '{"dashboard": "config"}';
        process.env.CLUSTER_CONFIG = '{"cluster": "config"}';
        process.env.ACTION_CONFIG = '{"action": "config"}';
        process.env.CRONJOB_CONFIG = '{"cronjob": "config"}';

        //WHEN
        const configuration = getConfiguration();

        //THEN
        expect(configuration).toEqual({
            dashboardConfig: expectedDashboardConfig,
            actionConfig: expectedDashboardActionConfig,
            k8sClusterConfig: expectedClusterConfig,
            cronjobConfig: expectedCronjobConfig
        });
    });
});
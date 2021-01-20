describe('getConfiguration', () => {

    beforeEach(() => {
        jest.resetModules()
    })

    test.each([
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
    ])("should not throw for missing optional config %s",
        (_, setDashboardConfig, setClusterConfig, setDashboardActionConfig, setCronjob) =>{
            //GIVEN
            const { getConfiguration } = require("./get-configuration.function")

            setDashboardConfig();
            setClusterConfig();
            setDashboardActionConfig();
            setCronjob();

            //WHEN
            expect(getConfiguration)
                //THEN
                .not.toThrow();
        })

    it("should throw if DASHBOARD_CONFIG is not set", () => {
        //GIVEN
        const { getConfiguration } = require("./get-configuration.function")

        process.env.DASHBOARD_CONFIG = ""
        process.env.CLUSTER_CONFIG = "{}"
        process.env.ACTION_CONFIG = "{}"
        process.env.CRONJOB_CONFIG = "{}"

        //WHEN
        expect(getConfiguration)
            //THEN
            .toThrow(`Invalid configuration: Environment DASHBOARD_CONFIG is empty or undefined.`)
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
    ])("should throw if %s is set and invalid",
        (invalidVariable, setDashboardConfig, setClusterConfig, setDashboardActionConfig, setCronjobConfig) => {
            //GIVEN
            const { getConfiguration } = require("./get-configuration.function")

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
        const { getConfiguration } = require("./get-configuration.function")

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

    test.each([
        [
            "DASHBOARD_CONFIG",
            () => process.env.DASHBOARD_CONFIG = '{"someCrazyProperty": "42"}',
            () => process.env.CLUSTER_CONFIG = '{}',
            () => process.env.ACTION_CONFIG = '{}',
            () => process.env.CRONJOB_CONFIG = '{}'
        ],
        [
            "CLUSTER_CONFIG",
            () => process.env.DASHBOARD_CONFIG = '{}',
            () => process.env.CLUSTER_CONFIG = '{"someCrazyProperty": "42"}',
            () => process.env.ACTION_CONFIG = '{}',
            () => process.env.CRONJOB_CONFIG = '{}'
        ],
        [
            "ACTION_CONFIG",
            () => process.env.DASHBOARD_CONFIG = '{}',
            () => process.env.CLUSTER_CONFIG = '{}',
            () => process.env.ACTION_CONFIG = '{"someCrazyProperty": "42"}',
            () => process.env.CRONJOB_CONFIG = '{}'
        ],
        [
            "CRONJOB_CONFIG",
            () => process.env.DASHBOARD_CONFIG = '{}',
            () => process.env.CLUSTER_CONFIG = '{}',
            () => process.env.ACTION_CONFIG = '{}',
            () => process.env.CRONJOB_CONFIG = '{"someCrazyProperty": "42"}'
        ]
    ])("should throw if %s contains random field",
      (invalidVariable, setDashboardConfig, setClusterConfig, setDashboardActionConfig, setCronjobConfig) => {
          //GIVEN
          const { getConfiguration } = require("./get-configuration.function")

          setDashboardConfig();
          setClusterConfig();
          setDashboardActionConfig();
          setCronjobConfig();

          //WHEN
          expect(getConfiguration)
            //THEN
            .toThrow(`Invalid configuration: ${invalidVariable} does not match the specification`)
      });
});
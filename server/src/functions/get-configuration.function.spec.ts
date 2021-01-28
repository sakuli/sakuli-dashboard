import { DashboardConfig } from "../config/dashboard.config";
import { K8sClusterConfig } from "../config/k8s-cluster.config";
import { DashboardActionsConfig } from "../config/dashboard-actions.config";
import { CronjobConfig } from "../config/cronjob.config";

describe('getConfiguration', () => {

    beforeEach(() => {
        jest.resetModules()
    })

    const dashboardConfig: DashboardConfig = {displays: []};
    const clusterConfig: K8sClusterConfig = {
        cluster: {name: "foo", server: "bar", skipTLSVerify: false},
        user: {name: "Sören Sakuli"},
        namespace: "foo"
    };
    const actionConfig: DashboardActionsConfig = {actions: []};
    const cronjobConfig: CronjobConfig = {schedule: "* * * * * *", actionIdentifier: "id"}

    const dashboardConfigJson = JSON.stringify(dashboardConfig);
    const clusterConfigJson = JSON.stringify(clusterConfig);
    const actionConfigJson = JSON.stringify(actionConfig);
    const cronjobConfigJson = JSON.stringify(cronjobConfig);

    test.each([
        [
            "CLUSTER_CONFIG",
            () => process.env.DASHBOARD_CONFIG = dashboardConfigJson,
            () => process.env.CLUSTER_CONFIG = "",
            () => process.env.ACTION_CONFIG = actionConfigJson,
            () => process.env.CRONJOB_CONFIG = cronjobConfigJson
        ],
        [
            "ACTION_CONFIG",
            () => process.env.DASHBOARD_CONFIG = dashboardConfigJson,
            () => process.env.CLUSTER_CONFIG = clusterConfigJson,
            () => process.env.ACTION_CONFIG = "",
            () => process.env.CRONJOB_CONFIG = cronjobConfigJson
        ],
        [
            "CRONJOB_CONFIG",
            () => process.env.DASHBOARD_CONFIG = dashboardConfigJson,
            () => process.env.CLUSTER_CONFIG = clusterConfigJson,
            () => process.env.ACTION_CONFIG = actionConfigJson,
            () => process.env.CRONJOB_CONFIG = ""
        ]
    ])("should not throw %s is empty",
        (_, setDashboardConfig, setClusterConfig, setDashboardActionConfig, setCronjob) => {
            //GIVEN
            const {getConfiguration} = require("./get-configuration.function")

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

    it("should parse and store config", () => {

        //GIVEN
        const {getConfiguration} = require("./get-configuration.function")

        process.env.DASHBOARD_CONFIG = dashboardConfigJson;
        process.env.CLUSTER_CONFIG = clusterConfigJson;
        process.env.ACTION_CONFIG = actionConfigJson;
        process.env.CRONJOB_CONFIG = cronjobConfigJson;

        //WHEN
        const configuration = getConfiguration();

        //THEN
        expect(configuration).toEqual({
            dashboardConfig: dashboardConfig,
            actionConfig: actionConfig,
            k8sClusterConfig: clusterConfig,
            cronjobConfig: cronjobConfig
        });
    });

    test.each([
        [
            "DASHBOARD_CONFIG",
            () => process.env.DASHBOARD_CONFIG = '{"someCrazyProperty": "42"}',
            () => process.env.CLUSTER_CONFIG = clusterConfigJson,
            () => process.env.ACTION_CONFIG = actionConfigJson,
            () => process.env.CRONJOB_CONFIG = cronjobConfigJson
        ],
        [
            "CLUSTER_CONFIG",
            () => process.env.DASHBOARD_CONFIG = dashboardConfigJson,
            () => process.env.CLUSTER_CONFIG = '{"someCrazyProperty": "42"}',
            () => process.env.ACTION_CONFIG = actionConfigJson,
            () => process.env.CRONJOB_CONFIG = cronjobConfigJson
        ],
        [
            "ACTION_CONFIG",
            () => process.env.DASHBOARD_CONFIG = dashboardConfigJson,
            () => process.env.CLUSTER_CONFIG = clusterConfigJson,
            () => process.env.ACTION_CONFIG = '{"someCrazyProperty": "42"}',
            () => process.env.CRONJOB_CONFIG = cronjobConfigJson
        ],
        [
            "CRONJOB_CONFIG",
            () => process.env.DASHBOARD_CONFIG = dashboardConfigJson,
            () => process.env.CLUSTER_CONFIG = clusterConfigJson,
            () => process.env.ACTION_CONFIG = actionConfigJson,
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
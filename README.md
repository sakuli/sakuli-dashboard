# sakuli-dashboard
A small and simple dashboard application to show sakuli VNC-views and monitoring metrics. 

## Features
* Configurable display layout
* Configurable play button to perform actions on k8s cluster
* Automated display updates after play button has been clicked
* Automated updates on displays in case the service is only temporarily available
* Optional, configurable user authentication.

## Development
A k8s API is necessary in order to perform e2e-tests.

1. `npm i && npm run rebuild`
1. Alter test environment configuration in `setTestEnvironment.sh`
1. Load configuration  
    1. `source setLocalTestEnvironment.sh` for test environment config - depends on local setup.
1. `npm run start:dev`

## Versioning
Versioning is based on [SemVer](https://semver.org/) with the addition that config changes are also released and tagged
as a patch release.

(#dashboard-configuration)
## Dashboard configuration
_Interface implementation_ can be found in `server/src/config`. 

| Environment variable  | description                                                                       | interface implementation      |
|-----------------------|-----------------------------------------------------------------------------------|-------------------------------|
| DASHBOARD_CONFIG      | configures the displays (ordering, url, actions, etc.) shown in the dashboard     | `dashboard.config.ts`         |
| ACTION_CONFIG         | available actions to perform on the k8s cluster and corresponding display updates | `dashboard-actions.config.ts` |
| CLUSTER_CONFIG        | configures the cluster access (cluster address, access token, etc.)               | `k8s-cluster.config.ts`       |
| CRONJOB_CONFIG        | configures a cronjob to start a specific action                                   | `cronjob.config.ts`           |
| AUTHENTICATION_CONFIG | configures the authentication of the dashboard                                    | `authenticationConfig.ts`     |
| SAKULI_LICENSE_KEY    | XL-License to start the dashboard container                                       |                               |

To use an available action in a display configuration, the corresponding `actionIdentifier` defined in `ACTION_CONFIG` must be used.
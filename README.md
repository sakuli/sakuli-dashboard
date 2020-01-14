# sakuli-dashboard
A small and simple dashboard application to show sakuli VNC-views and monitoring metrics. 

## Features
* Configurable display layout
* Configurable play button to perform actions on k8s cluster
* Automated display updates after play button has been clicked

## Development
A k8s API is necessary in order to perform e2e-tests.

1. `npm i && npm run rebuild`
2. Alter test environment configuration in `setTestEnvironment.sh`
3. `source setTestEnvironment.sh`
4. `npm start`

## Configuration
_Interface implementation_ can be found in `server/src/config`. 

| Environment variable | description | interface implementation |
| --- | --- | --- |
| DASHBOARD_CONFIG | configures the displays (ordering, url, actions, etc.) shown in the dashboard | `dashboard.config.ts` |
| ACTION_CONFIG | available actions to perform on the k8s cluster and corresponding display updates | `dashboard-actions.config.ts` |
| CLUSTER_CONFIG | configures the cluster access (cluster address, access token, etc.) | `k8s-cluster.config.ts` |

To use an available action in a display configuration, the corresponding `actionIdentifier` defined in `ACTION_CONFIG` must be used. 
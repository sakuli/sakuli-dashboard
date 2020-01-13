# sakuli-dashboard
A small and simple dashboard application to show sakuli VNC-views and monitoring metrics. 

## Features
* Configurable display layout
* Configurable play button to perform actions on k8s cluster
* Automated display updates after play button has been clicked

## Development
A k8s API is necessary in order to perform e2e-tests.

1. `npm i && npm run rebuild`
1. Alter test environment configuration in `setTestEnvironment.sh`
1. Load configuration  
    1. `source setTestEnvironment.sh` for test environment config - depends on local setup.  
    1. `source openshift/load-config.sh <CONFIG_FILE>` to load prod configuration. (Requires access to the prod cluster)
1. `npm start`

(#dashboard-configuration)
## Dashboard configuration
_Interface implementation_ can be found in `server/src/config`. 

| Environment variable | description                                                                       | interface implementation      |
|----------------------|-----------------------------------------------------------------------------------|-------------------------------|
| DASHBOARD_CONFIG     | configures the displays (ordering, url, actions, etc.) shown in the dashboard     | `dashboard.config.ts`         |
| ACTION_CONFIG        | available actions to perform on the k8s cluster and corresponding display updates | `dashboard-actions.config.ts` |
| CLUSTER_CONFIG       | configures the cluster access (cluster address, access token, etc.)               | `k8s-cluster.config.ts`       |

To use an available action in a display configuration, the corresponding `actionIdentifier` defined in `ACTION_CONFIG` must be used.

## Operations on OpenShift
### Configuration files
Configurations for each deployment are stored in `openshift/configs`. The configuration scripts export environment
variables in order to configure the dashboard as specified in the [dashboard configuration](#dashboard-configuration)
section.

In addition, the following deployment relevant fields are specified in the config files. 

| Prameter         | Mandatory | Description                                                          |
|------------------|-----------|----------------------------------------------------------------------|
| NAMESPACE        | YES       | Namespace to create and deploy the showcase in.                      |
| SERVICE_NAME     | YES       | Name of the service which will be bootstrapped.                      |
| ACTION_NAMESPACE | NO        | Namespace to perform the dashboard actions in. default: <NAMESPACE>. |

### Deployment
#### Bootstrapping
```shell script
oc login <ClusterToBootstrapOn>
sh openshift/bootstrap.sh ${GITHUB_SOURCE_SECRET_PATH} ${CONFIG_FILE}
```
| Parameter                 | Description                                                                                           |
|---------------------------|-------------------------------------------------------------------------------------------------------|
| GITHUB_SOURCE_SECRET_PATH | Path to the private key for the ssh github source secret.                                             |
| CONFIG_FILE               | Name of the config file to be loaded e.g. `pink-coffee.sh` (must be located in `openshift/configs`).  | 

#### Updating configuration
```shell script
oc login <ClusterToConfigureOn>
sh openshift/update-config.sh ${CONFIG_FILE}
```
| Parameter    | Description                                                                                                           |
|--------------|-----------------------------------------------------------------------------------------------------------------------|
| CONFIG_FILE  | Name of the config file to be updated on the cluster e.g. `pink-coffee.sh` (must be located in `openshift/configs`).  |
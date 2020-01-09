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

(#configuration)
## Configuration
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
variables as specified in the [configuration](#configuration) section.

### Deployment
#### Bootstrapping
```shell script
oc login <ClusterToBootstrapOn>
sh openshift/bootstrap.sh ${GITHUB_SOURCE_SECRET_PATH} ${NAMESPACE} ${SERVICE_NAME} ${CONFIG_FILE}
```
| Parameter                 | Description                                                                                           |
|---------------------------|-------------------------------------------------------------------------------------------------------|
| GITHUB_SOURCE_SECRET_PATH | Path to the private key for the ssh github source secret.                                             |
| NAMESPACE                 | Namespace to create and deploy the showcase in.                                                       |
| SERVICE_NAME              | Name of the service which will be bootstrapped.                                                       |
| CONFIG_FILE               | Name of the config file to be loaded e.g. `pink-coffee.sh` (must be located in `openshift/configs`).  | 

#### Updating configuration
```shell script
oc login <ClusterToConfigureOn>
sh openshift/update-config.sh ${NAMESPACE} ${SERVICE_NAME} ${CONFIG_FILE}
```
| Parameter    | Description                                                                                                           |
|--------------|-----------------------------------------------------------------------------------------------------------------------|
| NAMESPACE    | Namespace where the dashboard is deployed.                                                                            |
| SERVICE_NAME | Name of the dashboard service.                                                                                        |
| CONFIG_FILE  | Name of the config file to be updated on the cluster e.g. `pink-coffee.sh` (must be located in `openshift/configs`).  |
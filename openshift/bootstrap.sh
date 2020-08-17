#!/usr/bin/env bash
function help() {
    echo "Usage: sh bootstrap.sh <DOCKER_USERNAME> <DOCKER_PASSWORD> <CONFIG_FILE>"
    echo ""
    echo "Parameters:"
    echo "  DOCKER_USERNAME: Username for docker login"
    echo "  DOCKER_PASSWORD: Password for docker login"
    echo "  CONFIG_FILE: Name of the config file to be loaded (located in openshift/configs)."
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to a cluster first to deploy the Sakuli-Dashboard."
  exit 1
fi

DOCKER_USERNAME=${1}
DOCKER_PASSWORD=${2}
CONFIG_FILE=${3}
CONFIG_FILE_PATH=${DIR}/configs/${CONFIG_FILE}

[[ -z "${DOCKER_USERNAME}" ]] && echo "ERROR: DOCKER_USERNAME is not defined" && help && exit 1
[[ -z "${DOCKER_PASSWORD}" ]] && echo "ERROR: DOCKER_PASSWORD is not defined" && help && exit 1
[[ ! -f "${CONFIG_FILE_PATH}" ]] && echo "ERROR: CONFIG_FILE \"${CONFIG_FILE_PATH}\" does not exist" && help && exit 1

[[ -z "${SAKULI_LICENSE_KEY}" ]] && echo "ERROR: SAKULI_LICENSE_KEY is not in environment" && help && exit 1

source "${CONFIG_FILE_PATH}"
[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit 1
[[ -z "${SERVICE_NAME}" ]] && echo "ERROR: SERVICE_NAME is empty" && help && exit 1
[[ -z "${ACTION_NAMESPACE}" ]] && ACTION_NAMESPACE=${NAMESPACE}

oc projects | grep ${NAMESPACE}
if [[ ${?} == 0 ]]; then
  oc project ${NAMESPACE}
else
  oc new-project ${NAMESPACE}
fi

oc create sa "${SERVICE_NAME}" -n "${ACTION_NAMESPACE}"
oc policy add-role-to-user edit -n "${ACTION_NAMESPACE}" -z "${SERVICE_NAME}"
LOGIN_TOKEN=$(sh $DIR/utils/get-login-token.sh "${SERVICE_NAME}" "${ACTION_NAMESPACE}")
source ${CONFIG_FILE_PATH} #Update config with received login token

oc create secret generic sakuli-license-key \
    --from-literal="SAKULI_LICENSE_KEY=${SAKULI_LICENSE_KEY}"

oc create secret docker-registry dockerhub-sakuli-secret \
    --docker-server=docker.io \
    --docker-username="${DOCKER_USERNAME}" \
    --docker-password="${DOCKER_PASSWORD}" \
    --docker-email=unused

oc secrets link builder dockerhub-sakuli-secret

oc import-image sakuli-dashboard \
    --from=docker.io/taconsol/sakuli-dashboard \
    --confirm \
    --scheduled=true \
    --all=true \
    --reference-policy=local
#do we need reference-policy?

oc process -f dashboard-template.yml \
    -p SERVICE_NAME="${SERVICE_NAME}" \
    -p DASHBOARD_CONFIG="${DASHBOARD_CONFIG}" \
    -p ACTION_CONFIG="${ACTION_CONFIG}" \
    -p CLUSTER_CONFIG="${CLUSTER_CONFIG}" \
    -p CRONJOB_CONFIG="${CRONJOB_CONFIG}" \
    -p NAMESPACE="${NAMESPACE}" \
    | oc create -f -

oc expose svc/${SERVICE_NAME}

CREATE_ROUTE="oc create route edge ${SERVICE_NAME} --service ${SERVICE_NAME} --insecure-policy=Redirect"
if [ -n "${DASHBOARD_HOSTNAME}" ]; then
  CREATE_ROUTE="${CREATE_ROUTE} --hostname=${DASHBOARD_HOSTNAME}"
fi
$CREATE_ROUTE
oc label --overwrite route ${SERVICE_NAME} router=public
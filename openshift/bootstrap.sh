#!/usr/bin/env bash
function help() {
    echo "Usage: sh bootstrap.sh <GITHUB_SOURCE_SECRET_PATH> <CONFIG_FILE>"
    echo ""
    echo "Parameters:"
    echo "  GITHUB_SOURCE_SECRET_PATH: Path to the private key for the ssh github source secret."
    echo "  CONFIG_FILE: Name of the config file to be loaded (located in openshift/configs)."
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to a cluster first to deploy the Sakuli-Dashboard."
  exit 1
fi

GITHUB_SOURCE_SECRET_PATH=${1}
CONFIG_FILE=${2}
CONFIG_FILE_PATH=${DIR}/configs/${CONFIG_FILE}

[[ ! -f "${GITHUB_SOURCE_SECRET_PATH}" ]] && echo "ERROR: GITHUB_SOURCE_SECRET_PATH \"${GITHUB_SOURCE_SECRET_PATH}\" does not exist" && help && exit 1
[[ ! -f "${CONFIG_FILE_PATH}" ]] && echo "ERROR: CONFIG_FILE \"${CONFIG_FILE_PATH}\" does not exist" && help && exit 1

source ${CONFIG_FILE_PATH}
[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit 1
[[ -z "${SERVICE_NAME}" ]] && echo "ERROR: SERVICE_NAME is empty" && help && exit 1
[[ -z "${ACTION_NAMESPACE}" ]] && ACTION_NAMESPACE=${NAMESPACE}

oc projects | grep ${NAMESPACE}
if [[ ${?} == 0 ]]; then
  oc project ${NAMESPACE}
else
  oc new-project ${NAMESPACE}
fi

GITHUB_SOURCE_SECRET="github-sakuli-dashboard"
oc create secret generic ${GITHUB_SOURCE_SECRET} \
    --from-file=ssh-privatekey=${GITHUB_SOURCE_SECRET_PATH} \
    --type=kubernetes.io/ssh-auth

oc create sa "${SERVICE_NAME}" -n "${ACTION_NAMESPACE}"
oc policy add-role-to-user edit -n "${ACTION_NAMESPACE}" -z "${SERVICE_NAME}"
LOGIN_TOKEN=$(sh $DIR/utils/get-login-token.sh "${SERVICE_NAME}" "${ACTION_NAMESPACE}")
source ${CONFIG_FILE_PATH} #Update config with received login token

oc new-app git@github.com:sakuli/sakuli-dashboard.git \
    --name="${SERVICE_NAME}" \
    --strategy=docker \
    --source-secret=${GITHUB_SOURCE_SECRET} \
    -e DASHBOARD_CONFIG="${DASHBOARD_CONFIG}" \
    -e ACTION_CONFIG="${ACTION_CONFIG}" \
    -e CLUSTER_CONFIG="${CLUSTER_CONFIG}" \
    -e CRONJOB_CONFIG="${CRONJOB_CONFIG}"

CREATE_ROUTE="oc create route edge ${SERVICE_NAME} --service ${SERVICE_NAME} --insecure-policy=Redirect"
if [ -n "${DASHBOARD_HOSTNAME}" ]; then
  CREATE_ROUTE="${CREATE_ROUTE} --hostname=${DASHBOARD_HOSTNAME}"
fi
$CREATE_ROUTE
oc label --overwrite route ${SERVICE_NAME} router=public
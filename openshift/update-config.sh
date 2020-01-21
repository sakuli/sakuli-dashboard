#!/usr/bin/env bash
function help() {
    echo "Usage: sh update-config.sh <CONFIG_FILE>"
    echo ""
    echo "Parameters:"
    echo "  CONFIG_FILE: Name of the config file to be updated on the cluster (located in openshift/configs)."
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to a cluster first to update the configuration."
  exit 1
fi

CONFIG_FILE=${1}
CONFIG_FILE_PATH=${DIR}/configs/${CONFIG_FILE}
[[ ! -f "${CONFIG_FILE_PATH}" ]] && echo "ERROR: CONFIG_FILE \"${CONFIG_FILE_PATH}\" does not exist" && help && exit 1

source ${CONFIG_FILE_PATH}
[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit 1
[[ -z "${SERVICE_NAME}" ]] && echo "ERROR: SERVICE_NAME is empty" && help && exit 1
[[ -z "${ACTION_NAMESPACE}" ]] && ACTION_NAMESPACE=${NAMESPACE}

oc projects | grep ${NAMESPACE}
if [[ ${?} == 0 ]]; then
  oc project ${NAMESPACE}
else
  echo "ERROR: Namepace ${NAMESPACE} not found on cluster."
  exit 1
fi


LOGIN_TOKEN=$(sh ${DIR}/utils/get-login-token.sh "${SERVICE_NAME}" "${ACTION_NAMESPACE}")
source ${CONFIG_FILE_PATH} #Update config with received login token

oc set env dc/${SERVICE_NAME} \
    --overwrite \
    -e DASHBOARD_CONFIG="${DASHBOARD_CONFIG}" \
    -e ACTION_CONFIG="${ACTION_CONFIG}" \
    -e CLUSTER_CONFIG="${CLUSTER_CONFIG}"
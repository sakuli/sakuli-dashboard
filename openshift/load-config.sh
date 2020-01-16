#!/usr/bin/env bash
function help() {
    echo "Usage: source load-config.sh <CONFIG_FILE>"
    echo ""
    echo "Description: Loads the given configuration for debugging/development purproses"
    echo ""
    echo "Parameters:"
    echo "  CONFIG_FILE: Name of the config file to be updated on the cluster (located in openshift/configs)."
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to the target cluster first."
  exit 1
fi

CONFIG_FILE=${1}
CONFIG_FILE_PATH=${DIR}/configs/${CONFIG_FILE}
[[ ! -f "${CONFIG_FILE_PATH}" ]] && echo "ERROR: CONFIG_FILE \"${CONFIG_FILE_PATH}\" does not exist" && help && exit 1

source ${CONFIG_FILE_PATH}
[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit 1
[[ -z "${SERVICE_NAME}" ]] && echo "ERROR: SERVICE_NAME is empty" && help && exit 1
[[ -z "${ACTION_NAMESPACE}" ]] && ACTION_NAMESPACE=${NAMESPACE}

LOGIN_TOKEN=$(sh $DIR/utils/get-login-token.sh "${SERVICE_NAME}" "${ACTION_NAMESPACE}")

source ${CONFIG_FILE_PATH}
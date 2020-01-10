#!/usr/bin/env bash
function help() {
    echo "Usage: sh update-config.sh <NAMESPACE> <SERVICE_NAME> <CONFIG_FILE> [-an [<ACTION_NAMESPACE>]]"
    echo ""
    echo "Parameters:"
    echo "  NAMESPACE: Namespace where the dashboard is deployed."
    echo "  SERVICE_NAME: Name of the dashboard service."
    echo "  CONFIG_FILE: Name of the config file to be updated on the cluster (located in openshift/configs)."
    echo ""
    echo "Options: "
    echo "  -an <ACTION_NAMESPACE>: Namespace to perform the dashboard actions in. default: <NAMESPACE>."
}

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to a cluster first to deploy the Sakuli-Dashboard."
  exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

NAMESPACE="${1}"
SERVICE_NAME="${2}"
CONFIG_FILE="${3}"

[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit 1
[[ -z "${SERVICE_NAME}" ]] && echo "ERROR: SERVICE_NAME is empty" && help && exit 1
[[ -z "${CONFIG_FILE}" ]] && echo "ERROR: CONFIG_FILE is empty" && help && exit 1
ACTION_NAMESPACE=${NAMESPACE}

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -an)
      ACTION_NAMESPACE="$2"
    shift
    shift
    ;;
    *)
    shift
    ;;
esac
done

LOGIN_TOKEN=$(sh ${DIR}/utils/get-login-token.sh "${SERVICE_NAME}" "${ACTION_NAMESPACE}")

source openshift/configs/${CONFIG_FILE}
oc set env dc/${SERVICE_NAME} \
    --overwrite \
    -e DASHBOARD_CONFIG="${DASHBOARD_CONFIG}" \
    -e ACTION_CONFIG="${ACTION_CONFIG}" \
    -e CLUSTER_CONFIG="${CLUSTER_CONFIG}"
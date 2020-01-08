function help() {
    echo "Usage: sh update-config.sh <NAMESPACE> <SERVICE_NAME> <CONFIG_FILE>"
    echo ""
    echo "Parameters:"
    echo "  NAMESPACE: Namespace to create and deploy the showcase in"
    echo "  SERVICE_NAME: Name of the service which will be bootstrapped"
    echo "  CONFIG_FILE: Name of the config file to be loaded (located in openshift/configs)."
}

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to a cluster first to deploy the Sakuli-Dashboard."
fi

NAMESPACE="${1}"
SERVICE_NAME="${2}"
CONFIG_FILE="${3}"

[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit
[[ -z "${SERVICE_NAME}" ]] && echo "ERROR: SERVICE_NAME is empty" && help && exit
[[ -z "${CONFIG_FILE}" ]] && echo "ERROR: CONFIG_FILE is empty" && help && exit

source openshift/configs/${CONFIG_FILE}
oc set env dc/${SERVICE_NAME} \
    --overwrite \
    -e DASHBOARD_CONFIG="${DASHBOARD_CONFIG}" \
    -e ACTION_CONFIG="${ACTION_CONFIG}" \
    -e CLUSTER_CONFIG="${CLUSTER_CONFIG}"
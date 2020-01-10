#!/usr/bin/env bash
function help() {
    echo "Usage: sh bootstrap.sh <GITHUB_SOURCE_SECRET_PATH> <NAMESPACE> <SERVICE_NAME> <CONFIG_FILE> [-an <ACTION_NAMESPACE>]"
    echo ""
    echo "Parameters:"
    echo "  GITHUB_SOURCE_SECRET_PATH: Path to the private key for the ssh github source secret."
    echo "  NAMESPACE: Namespace to create and deploy the dashboard in."
    echo "  SERVICE_NAME: Name of the service which will be bootstrapped."
    echo "  CONFIG_FILE: Name of the config file to be loaded (located in openshift/configs)."
    echo ""
    echo "Options: "
    echo "  -an ACTION_NAMESPACE: Namespace to perform the dashboard actions in. default: <NAMESPACE>."
}

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to a cluster first to deploy the Sakuli-Dashboard."
  exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

GITHUB_SOURCE_SECRET_PATH="${1}"
NAMESPACE="${2}"
SERVICE_NAME="${3}"
CONFIG_FILE="${4}"

[[ -z "${GITHUB_SOURCE_SECRET_PATH}" ]] && echo "ERROR: GITHUB_SOURCE_SECRET_PATH is empty" && help && exit 1
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

source openshift/configs/${CONFIG_FILE}
oc new-app centos/nodejs-12-centos7~git@github.com:sakuli/sakuli-dashboard.git#sakuli/pink-coffee#7/deploy-dashboard \
    --source-secret=${GITHUB_SOURCE_SECRET} \
    -e DASHBOARD_CONFIG="${DASHBOARD_CONFIG}" \
    -e ACTION_CONFIG="${ACTION_CONFIG}" \
    -e CLUSTER_CONFIG="${CLUSTER_CONFIG}"

oc expose service "${SERVICE_NAME}" -l router=public
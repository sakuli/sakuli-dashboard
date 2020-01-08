function help() {
    echo "Usage: sh bootstrap.sh <GITHUB_SOURCE_SECRET_PATH> <NAMESPACE> <SERVICE_NAME>"
    echo ""
    echo "Parameters:"
    echo "  GITHUB_SOURCE_SECRET_PATH: Path to the private key for the ssh github source secret"
    echo "  NAMESPACE: Namespace to create and deploy the showcase in"
    echo "  SERVICE_NAME: Name of the service which will be bootstrapped"
}

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to a cluster first to deploy the Sakuli-Dashboard."
fi

GITHUB_SOURCE_SECRET_PATH="${1}"
NAMESPACE="${2}"
SERVICE_NAME="${3}"

[[ -z "${GITHUB_SOURCE_SECRET_PATH}" ]] && echo "ERROR: GITHUB_SOURCE_SECRET_PATH is empty" && help && exit
[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit
[[ -z "${SERVICE_NAME}" ]] && echo "ERROR: SERVICE_NAME is empty" && help && exit

oc projects | grep ${NAMESPACE}
if [[ ${?} == 0 ]]; then
  oc project ${NAMESPACE}
else
  oc create-project ${NAMESPACE}
fi
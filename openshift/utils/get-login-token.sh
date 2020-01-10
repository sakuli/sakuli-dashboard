#!/usr/bin/env bash

function help() {
    echo "Usage: sh get-login-token.sh <SERVICE_ACCOUNT_NAME> <NAMESPACE>"
    echo ""
    echo "Receives the login token of a service account from a given namespace"
    echo ""
    echo "Parameters:"
    echo "  SERVICE_ACCOUNT_NAME: Name of the service account to get the token for."
    echo "  NAMESPACE: Namespace in which the service account exists."
}

oc status > /dev/null 2>&1
if [[ ${?} != 0 ]]; then
  echo "ERROR: Please login to a cluster first to deploy the Sakuli-Dashboard."
  exit 1
fi

SERVICE_ACCOUNT_NAME=${1}
NAMESPACE=${2}

[[ -z "${SERVICE_ACCOUNT_NAME}" ]] && echo "ERROR: SERVICE_ACCOUNT_NAME is empty" && help && exit
[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit



TOKEN_SECRET=$(oc describe sa ${SERVICE_ACCOUNT_NAME} -n ${NAMESPACE} | grep "Tokens:" | sed "s/Tokens://g" | tr -d '[:space:]')
LOGIN_TOKEN=$(oc describe secret ${TOKEN_SECRET} -n ${NAMESPACE} | grep "token:" | sed "s/token://g" |  tr -d '[:space:]')
echo ${LOGIN_TOKEN}
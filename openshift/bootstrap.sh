#!/usr/bin/env bash

function help() {
    echo "Usage: sh bootstrap.sh <NAMESPACE> <DOCKER_USERNAME> <DOCKER_PASSWORD> <GITHUB_SOURCE_SECRET_PATH> <ENCRYPTION_KEY>"
    echo ""
    echo "Parameters:"
    echo "  NAMESPACE: Namespace to create and deploy the showcase in"
    echo "  DOCKER_USERNAME: Dockerhub user with access to taconsol"
    echo "  DOCKER_PASSWORD: Password of the dockerhub user"
    echo "  GITHUB_SOURCE_SECRET_PATH: Path to the private key for the ssh github source secret"
    echo "  ENCRYPTION_KEY: Sakuli encryption key"
}

NAMESPACE="${1}"
DOCKER_USERNAME="${2}"
DOCKER_PASSWORD="${3}"
GITHUB_SOURCE_SECRET_PATH="${4}"
ENCRYPTION_KEY="${5}"
SAKULI_LICENSE_KEY=$(cat "../license.key")

[[ -z "${NAMESPACE}" ]] && echo "ERROR: NAMESPACE is empty" && help && exit
[[ -z "${DOCKER_USERNAME}" ]] && echo "ERROR: DOCKER_USERNAME is empty" && help  && exit
[[ -z "${DOCKER_PASSWORD}" ]] && echo "ERROR: DOCKER_PASSWORD is empty" && help && exit
[[ -z "${GITHUB_SOURCE_SECRET_PATH}" ]] && echo "ERROR: GITHUB_SOURCE_SECRET_PATH is empty" && help && exit
[[ -z "${SAKULI_LICENSE_KEY}" ]] && echo "ERROR: missing license.key file" && help && exit
[[ -z "${ENCRYPTION_KEY}" ]] && echo "ERROR: ENCRYPTION_KEY is empty" && help && exit

oc projects | grep "${NAMESPACE}" > /dev/null
if [[ $? == "0" ]]; then
  oc project ${NAMESPACE}
else
  oc new-project ${NAMESPACE}
fi

oc create secret docker-registry dockerhub-sakuli-secret \
    --docker-server=docker.io \
    --docker-username="${DOCKER_USERNAME}" \
    --docker-password="${DOCKER_PASSWORD}" \
    --docker-email=unused

oc secrets link builder dockerhub-sakuli-secret

oc create sa "${NAMESPACE}" -n "${NAMESPACE}"
oc policy add-role-to-user edit -n "${NAMESPACE}" -z "${NAMESPACE}"

TOKEN_SECRET=$(oc describe sa ${NAMESPACE} -n ${NAMESPACE} | grep "Tokens:" | sed "s/Tokens://g" | tr -d '[:space:]')
LOGIN_TOKEN=$(oc describe secret ${TOKEN_SECRET} -n ${NAMESPACE} | grep "token:" | sed "s/token://g" |  tr -d '[:space:]')

oc import-image prom/pushgateway:v1.2.0 \
    --confirm \
    --scheduled=true

oc import-image prom/prometheus:v2.17.2 \
    --confirm \
    --scheduled=true

oc import-image prom/alertmanager:v0.21.0 \
    --confirm \
    --scheduled=true

oc import-image grafana/grafana:6.7.3 \
    --confirm \
    --scheduled=true

oc import-image sakuli-s2i-remote-connection \
    --from=docker.io/taconsol/sakuli-s2i-remote-connection \
    --confirm \
    --scheduled=true \
    --all=true

oc import-image sakuli-dashboard \
   --from=docker.io/taconsol/sakuli-dashboard \
   --confirm \
   --scheduled=true \
   --all=true

oc delete configmap prometheus-config
oc create configmap prometheus-config --from-file=prometheus-config.yml --from-file=alert-rules.yml
oc delete configmap grafana-datasource
oc create configmap grafana-datasource --from-file=grafana-datasource.yml
oc delete configmap grafana-dashboard
oc create configmap grafana-dashboard --from-file=grafana-dashboard.json --from-file=grafana-dashboard-config.yml
oc delete configmap alertmanager-config
oc create configmap alertmanager-config --from-file=alertmanager-config.yml

SOURCE_SECRET="sakuli-dashboard-test-source-secret"
oc create secret generic "${SOURCE_SECRET}" \
    --from-file=ssh-privatekey="${GITHUB_SOURCE_SECRET_PATH}" \
    --type=kubernetes.io/ssh-auth

oc create secret generic sakuli-encryption-key \
    --from-literal="key=${ENCRYPTION_KEY}"

CLUSTER_NAME=$(oc whoami --show-context=true)
CLUSTER_SERVER=$(oc whoami --show-server=true)

OC_APPLY="oc process -f monitoring-template.yml
            -p NAMESPACE=${NAMESPACE}
            -p TESTSUITE_REPOSITORY_SECRET=${SOURCE_SECRET}
            -p SAKULI_LICENSE_KEY=${SAKULI_LICENSE_KEY}
            -p LOGIN_TOKEN=${LOGIN_TOKEN}
            -p CLUSTER_NAME=${CLUSTER_NAME}
            -p CLUSTER_SERVER=${CLUSTER_SERVER}
            -p BUILDER_IMAGE_TAG=latest"
echo ${OC_APPLY}
${OC_APPLY} | oc apply -f -

oc create route edge sakuli-dashboard-test --service sakuli-dashboard-test --insecure-policy=Redirect --port=6901
oc create route edge grafana --service grafana --insecure-policy=Redirect --port=3000
oc create route edge dashboard  --hostname="sakuli-dashboard-test.paas.consol.de" --service dashboard --insecure-policy=Redirect
oc label --overwrite route sakuli-dashboard-test router=public
oc label --overwrite route grafana router=public
oc label --overwrite route dashboard router=public
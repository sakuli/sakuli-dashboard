#!/usr/bin/env bash

export NAMESPACE="sakuli-dashboard-test"
export SERVICE_NAME="sakuli-dashboard"
export ACTION_NAMESPACE="pink-coffee"

export DASHBOARD_CONFIG=$(cat <<EOF
{
   "displays":[
      {
         "index":1,
         "messages": {
             "de": {
                "description": "Test Ausführung - VNC Ansicht",
                "infoText": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
             },
             "en": {
                "description": "Test Execution - VNC View",
                "infoText": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
             }
         },
         "url":"https://pink-coffee-pink-coffee.paas.consol.de?password=vncpassword&scale=local&view_only=true",
         "actionIdentifier":"7890eab9-6c5e-4e40-b39c-163900ea4834"
      },
      {
         "index":2,
         "messages": {
             "de": {
                "description": "Dienstüberwachung"
             },
             "en": {
                "description": "Service Monitoring"
             }
         },
         "url":"https://ta-monitoring.aws-test.consol.de/demo/grafana/dashboard/script/histou.js?orgId=1&host=sakuli_client&service=CM_Sakuli_Demo&theme=light&annotations=true&refresh=5s&from=now-6h&to=now&kiosk=tv"
      }
   ]
}
EOF
)

export ACTION_CONFIG=$(cat <<EOF
{
   "actions":[
      {
         "actionIdentifier":"7890eab9-6c5e-4e40-b39c-163900ea4834",
         "action": {
            "metadata": {
              "labels": {
                "app": "pink-coffee"
              },
              "name":"pink-coffee"
            },
            "spec": {
              "containers": [
                {
                  "name": "pink-coffee",
                  "image": "docker-registry.default.svc:5000/pink-coffee/pink-coffee",
                  "env": [
                    {
                      "name": "VNC_VIEW_ONLY",
                      "value": "true"
                    },
                    {
                      "name": "SAKULI_ENCRYPTION_KEY",
                      "valueFrom": {
                        "secretKeyRef": {
                          "name": "sakuli-encryption-key",
                          "key": "key"
                        }
                      }
                    }
                  ]
                }
              ],
              "restartPolicy": "Never"
            }
         }
      }
   ]
}
EOF
)

export CLUSTER_CONFIG=$(cat <<EOF
{
   "cluster":{
      "name":"$(oc whoami --show-context=true)",
      "server":"$(oc whoami --show-server=true)"
   },
   "user":{
      "name":"${SERVICE_NAME}",
      "token":"${LOGIN_TOKEN}"
   },
   "namespace":"${ACTION_NAMESPACE}"
}
EOF
)

export CRONJOB_CONFIG=$(cat <<EOF
{
    "schedule": "0 0 * * *",
    "actionIdentifier": "7890eab9-6c5e-4e40-b39c-163900ea4834"
}
EOF
)
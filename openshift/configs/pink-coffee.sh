#!/usr/bin/env bash

export NAMESPACE="sakuli-dashboards"
export SERVICE_NAME="pink-coffee-dashboard"
export ACTION_NAMESPACE="pink-coffee"
export DASHBOARD_HOSTNAME="sakuli-cm-demo.paas.consol.de"

export DASHBOARD_CONFIG=$(cat <<EOF
{
   "displays":[
      {
         "index":1,
         "messages": {
             "de": {
                "description": "Drücken Sie auf Start, lehnen Sie sich zurück und sehen Sie Sakuli bei der Arbeit zu.",
"infoText": "Das Testsystem dieser Demo besteht aus einem Ticketsystem und einer Windows VM. Im ersten Schritt wird ein Ticket erstellt, um den Prozess als Endkunde zu simulieren. Anschließend wird das Ticket für die Abarbeitung geöffnet. Während diesem Prozess verbindet sich Sakuli per RDP mit einer Windows VM. Dort werden alle bearbeiteten Tickets in Excel archiviert und zusätzlich in Paint das Sakuli Logo gezeichnet. Zum Abschluss des Prozesses wird das Ticket geschlossen und geprüft, ob eine Email Bestätigung an den Enduser versandt wurde."
             },
             "en": {
                "description": "Press Start, Sit Back and Watch Sakuli Work.",
                "infoText": "The SUT is a ticket tool and a Windows VM. Firstly Sakuli creates a new Ticket to simulate an end user. Afterwards Sakuli simulates a business person and looks at the ticket. During this process Sakuli opens an RDP client and connects to a Windows VM to manage all the tickets. Then Sakuli paints the Sakuli logo in Paint. After the short detour the ticket is edited and closed. At the end it is checked again if an email was sent to the end user according to the process."
             }
         },
         "url":"https://pink-coffee-pink-coffee.paas.consol.de?password=vncpassword&scale=local&view_only=true",
         "actionIdentifier":"7890eab9-6c5e-4e40-b39c-163900ea4834"
      },
      {
         "index":2,
         "messages": {
             "de": {
                "description": "Monitoring Daten: Erkennen von Mustern, Alerting und Screenshot Darstellung von Fehlern.",
                "infoText": "Hier können sie die Monitoring Daten in einem Grafana sehen, die Sakuli an ein OMD geschickt hat. Bei Fehler können Sie die Maus über diese bewegen um den Screenshot ansehen."
             },
             "en": {
                "description": "Monitoring Data: Recognize Patterns, Alerting and Display Error Screenshots.",
                "infoText": "This is a Grafana Dashboard with the Data of the shown test, which Sakuli sent to a OMD. In case of an error during the Sakuli test, a screenshot will be sent with the monitoring data which then will be shown here."
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

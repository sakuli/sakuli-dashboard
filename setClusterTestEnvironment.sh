export DASHBOARD_CONFIG=$(cat <<EOF
{
  "displays": [
    {
      "index": 1,
      "messages": {
        "de": {
          "description": "Drücken Sie auf Start, lehnen Sie sich zurück und sehen Sie Sakuli bei der Arbeit zu.",
          "infoText": "Das Testsystem dieser Demo besteht aus einem Ticketsystem und einer Windows VM. Im ersten Schritt wird ein Ticket erstellt, um den Prozess als Endkunde zu simulieren. Anschließend wird das Ticket für die Abarbeitung geöffnet. Während diesem Prozess verbindet sich Sakuli per RDP mit einer Windows VM. Dort werden alle bearbeiteten Tickets in Excel archiviert und zusätzlich in Paint das Sakuli Logo gezeichnet. Zum Abschluss des Prozesses wird das Ticket geschlossen und geprüft, ob eine Email Bestätigung an den Enduser versandt wurde."
        },
        "en": {
          "description": "Press Start, Sit Back and Watch Sakuli Work.",
          "infoText": "The system under test in this demo consists of a ticket system and a Windows VM. As a first step, a ticket is created to simulate the customer process. Afterwards this ticket is opened for processing. During this process, Sakuli connects to a Windows VM via RDP to archive all processed tickets in Excel. Additionally, Sakuli will draw its own logo in Paint. To finish the process the ticket gets closed and Sakuli verifies whether an email confirmation has been sent to the end user."
        }
      },
      "url": "https://pink-coffee-pink-coffee.paas.consol.de?password=vncpassword&scale=local&view_only=true",
      "actionIdentifier": "7890eab9-6c5e-4e40-b39c-163900ea4834"
    },
    {
      "index": 2,
      "type": "website",
      "messages": {
        "de": {
          "description": "Monitoring Daten: Erkennen von Mustern, Alerting und Screenshot Darstellung von Fehlern.",
          "infoText": "Hier sehen Sie Monitoring Daten in einem Grafana Dashboard, die Sakuli an ein OMD System weitergeleitet hat. Bei Fehlern können Sie die Maus über diese bewegen um einen Fehlerscreenshot einzublenden."
        },
        "en": {
          "description": "Monitoring Data: Recognize Patterns, Alerting and Display Error Screenshots.",
          "infoText": "This is a Grafana Dashboard showing monitoring data which Sakuli provided to OMD. In case of an error during the Sakuli test, a screenshot will be sent with the monitoring data which then will be shown here."
        }
      },
      "url": "https://grafana-pink-coffee.paas.consol.de/d/A7K5C_cGz/circit-sakuli-poc?orgId=1&from=now-6h&to=now&theme=light&kiosk=tv"
    },
    {
      "index": 3,
      "type": "logs",
      "messages": {
        "de": {
          "description": "Monitoring Daten: Erkennen von Mustern, Alerting und Screenshot Darstellung von Fehlern.",
          "infoText": "Hier sehen Sie Monitoring Daten in einem Grafana Dashboard, die Sakuli an ein OMD System weitergeleitet hat. Bei Fehlern können Sie die Maus über diese bewegen um einen Fehlerscreenshot einzublenden."
        },
        "en": {
          "description": "Monitoring Data: Recognize Patterns, Alerting and Display Error Screenshots.",
          "infoText": "This is a Grafana Dashboard showing monitoring data which Sakuli provided to OMD. In case of an error during the Sakuli test, a screenshot will be sent with the monitoring data which then will be shown here."
        }
      },
      "actionIdentifier": "7890eab9-6c5e-4e40-b39c-163900ea4834"
    }
  ],
  "defaultLayout": "row"
}
EOF
)

export ACTION_CONFIG=$(cat <<EOF
{
  "actions": [
    {
      "actionIdentifier": "7890eab9-6c5e-4e40-b39c-163900ea4834",
      "action": {
        "metadata": {
          "labels": {
            "app": "pink-coffee"
          },
          "name": "pink-coffee"
        },
        "spec": {
          "volumes": [
            {
              "name": "dshm",
              "emptyDir": {
                "medium": "Memory"
              }
            }
          ],
          "containers": [
            {
              "name": "pink-coffee",
              "image": "docker-registry.default.svc:5000/pink-coffee/pink-coffee",
              "volumeMounts": [
                {
                  "mountPath": "/dev/shm",
                  "name": "dshm"
                }
              ],
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
  "cluster": {
    "name": "pink-coffee/master-ext1-ocp-consol-de:443/taadmin",
    "server": "https://master.ext1.ocp.consol.de:443"
  },
  "user": {
    "name": "taadmin",
    "token": "8uaEfsoGnkxAyvKvf1560N-wApkCK3MSrPOfLMCsNc8"
  },
  "namespace": "pink-coffee"
}
EOF
)

export CRONJOB_CONFIG=$(cat <<EOF
{
  "schedule": "*/20 * * * *",
  "actionIdentifier": "7890eab9-6c5e-4e40-b39c-163900ea4834"
}
EOF
)

#credentials:
# awesome:dude
# Authorization: Basic YXdlc29tZTpkdWRl
#export AUTHENTICATION_CONFIG=$(cat <<EOF
#{
#  "users": {
#    "awesome": "\$argon2i\$v=19\$m=4096,t=3,p=1\$4UeAY4g93dU0mEx8fcS5fQ\$oMxbMHhs5fW8H2aP13vRGk2ENuZGNbCAdXeT16a3gRA"
#  },
#  "jwtTokenSecret": "a32541b9-76b4-4fa3-b2c0-6d9ef03c2a63",
#  "jwtRefreshTokenSecret": "4804c6d5-74b0-4032-8442-51d1f7d7257c"
#}
#EOF
#)
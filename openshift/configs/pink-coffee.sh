export DASHBOARD_CONFIG=$(cat <<EOF
{
   "displays":[
      {
         "index":1,
         "url":"http://pink-coffee-pink-coffee.paas.consol.de?password=vncpassword",
         "actionIdentifier":"7890eab9-6c5e-4e40-b39c-163900ea4834"
      },
      {
         "index":2,
         "url":"https://ta-monitoring.aws-test.consol.de/demo/grafana/dashboard/script/histou.js?orgId=1&host=sakuli_client&service=CM_Sakuli_Demo&theme=light&annotations=true&refresh=10s&from=now-1h&to=now"
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
              "generateName":"pink-coffee-"
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
      "name":"consol-ext",
      "server":"https://master.ext1.ocp.consol.de:8443"
   },
   "user":{
      "name":"taadmin",
      "token":"uf8RqRJV1Ghhod5L_XVnU1C6dvYALyE6wjOZe700CYU"
   },
   "namespace":"pink-coffee"
}
EOF
)
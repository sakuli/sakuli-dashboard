export DASHBOARD_CONFIG=$(cat <<EOF
{
   "displays":[
      {
         "index":1,
         "url":"http://sakuli-myproject.192.168.99.113.nip.io/vnc.html?password=vncpassword",
         "actionIdentifier":"7890eab9-6c5e-4e40-b39c-163900ea4834"
      },
      {
         "index":2,
         "url":"https://ta-monitoring.aws-test.consol.de/demo/grafana/dashboard-solo/script/histou.js?orgId=1&host=sakuli_client&service=CM_Sakuli_Demo&theme=light&annotations=true&refresh=30s&var-Case=All&panelId=3"
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
                "app": "sakuli"
              }
            },
            "spec": {
              "containers": [
                {
                  "name": "sakuli",
                  "image": "docker-registry.default.svc:5000/myproject/sakuli",
                  "env": [
                    {
                      "name": "SAKULI_LICENSE_KEY",
                      "value": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6MiwiaWF0IjoxNTY2MTk4MTUzLCJuYmYiOjE1NjYxOTgxNTMsImV4cCI6MTU5Nzc1NTc1MywiYXVkIjoiRG9ja2VyIiwiaXNzIjoic2FrdWxpLmlvIiwic3ViIjoic2FrdWxpX3VzZXIifQ.fkYXsV3aOj3C8X1PO8AKfeKHaaBGSiabDhzlOOPlseWHEYiXan-X6oP4WOkAUzFihhRFSFWHXzG7SYsWids8KQ"
                    }
                  ]
                }
              ]
            }
         },
         "displayUpdate":{
            "reloadDelay":2000
         }
      }
   ]
}
EOF
)

export CLUSTER_CONFIG=$(cat <<EOF
{
   "cluster":{
      "name":"cluster",
      "server":"https://192.168.99.113:8443",
      "skipTLSVerify":true
   },
   "user":{
      "name":"developer",
      "username":"developer",
      "password":"sachIchNich"
   },
   "namespace":"myproject"
}
EOF
)
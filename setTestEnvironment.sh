export DASHBOARD_CONFIG=$(cat <<EOF
{
   "displays":[
      {
         "index":1,
         "description": "Test Execution - VNC View",
         "url":"http://sakuli-demo-sakuli-demo.192.168.99.107.nip.io/vnc.html?password=vncpassword",
         "actionIdentifier":"7890eab9-6c5e-4e40-b39c-163900ea4834"
      },
      {
         "index":2,
         "description": "Service Monitoring",
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
                "app": "sakuli-demo"
              },
              "name":"sakuli-demo"
            },
            "spec": {
              "containers": [
                {
                  "name": "sakuli-demo",
                  "image": "172.30.1.1:5000/sakuli-demo/sakuli-demo",
                  "env": [
                    {
                      "name": "SAKULI_LICENSE_KEY",
                      "value": "${SAKULI_LICENSE_KEY}"
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
      "server":"https://192.168.99.107:8443",
      "skipTLSVerify":true
   },
   "user":{
      "name":"developer",
      "token":"IcgX0FmSitF6uUYgq1_hPOtFDRwZ40ONJjvQJfuG-PA"
   },
   "namespace":"sakuli-demo"
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
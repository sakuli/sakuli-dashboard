export DASHBOARD_CONFIG=$(cat <<EOF
{
   "displays":[
      {
         "index":1,
         "url":"http://pink-coffee-pink-coffee.paas.consol.de/vnc.html?password=vncpassword",
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
            "discriminator": "Sakuli Pod",
            "attributeTypeMap": []
         },
         "displayUpdate":{
            "reloadDelay":500
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
      "server":"kubernetes-default.192.168.99.113.nip.io",
      "skipTLSVerify":true
   },
   "user":{
      "name":"developer",
      "password":"sachIchNich"
   },
   "namespace":"myproject"
}
EOF
)
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
         "url":"https://ta-monitoring.aws-test.consol.de/demo/grafana/dashboard-solo/script/histou.js?orgId=1&host=sakuli_client&service=CM_Sakuli_Demo&theme=light&annotations=true&refresh=30s&from=1578272189278&to=1578300989278&var-Case=All&panelId=3"
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
         "action":"bar",
         "displayUpdate":{
            "reloadDelay":500
         }
      }
   ]
}
EOF
)
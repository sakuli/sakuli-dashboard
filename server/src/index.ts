import express from 'express'
import { join } from 'path'
import { executeAction } from "./service/action.service";
import { HttpStatusCode, SecurityConfigResponse } from "@sakuli-dashboard/api";
import { healthCheckService } from "./service/health-check.service";
import { Configuration, getConfiguration } from "./functions/get-configuration.function";
import { configureCronjob } from "./service/cronjob.service";
import { logger } from "./functions/logger";
import { handleGetDashboard } from "./handler/handle-get-dashboard";
import { writeLogsToStream } from "./service/logs.service";
import { enableAuthentication } from "./security/enable-authentication";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));
app.use(express.json());

let configuration: Configuration | undefined;

try{
  configuration = getConfiguration();
}catch (error){
  logger().error("Could not get configuration:", error)
}

if(configuration?.authenticationConfig){
  enableAuthentication(app, configuration.authenticationConfig);
}

app.get('/api/dashboard', handleGetDashboard(configuration?.dashboardConfig));

app.post('/api/dashboard/action', (req, res) => {
  executeAction(req.body)
      .then(displayUpdate => res.status(HttpStatusCode.ACCEPTED).send(displayUpdate))
      .catch(error => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(JSON.stringify(error)));
});

app.post('/api/dashboard/health-check', (req, res) => {
  healthCheckService().checkUrl(req.body)
      .then(status => res.status(200).send({status: status}));
});

app.get('/api/dashboard/action/logs/:actionIdentifier', (req, res ) => {
  const done = (err?: Error) => {
    if(err){
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send()
    } else{
      res.end()
    }
  }

  writeLogsToStream(req.params.actionIdentifier, res, done)
      .catch(_ => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send());
});

app.get('/api/security', (req, res) => {
  const securityConfig: SecurityConfigResponse = {
    authorizationEnabled: configuration?.authenticationConfig !== undefined
  }
  res.status(HttpStatusCode.OK).send(securityConfig);
})

configureCronjob(configuration?.cronjobConfig);

const port = 8080;

app.listen(port, () => logger().info(`Server started on port ${port}`));
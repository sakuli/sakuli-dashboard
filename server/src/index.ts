import express from 'express'
import { join } from 'path'
import { executeAction } from "./service/action.service";
import { HttpStatusCode } from "@sakuli-dashboard/api";
import { healthCheckService } from "./service/health-check.service";
import { Configuration, getConfiguration } from "./functions/get-configuration.function";
import { configureCronjob } from "./service/cronjob.service";
import { logger } from "./functions/logger";
import createBackendError from "./functions/create-backend-error.function";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));
app.use(express.json());

let configuration: Configuration | undefined;

try{
  configuration = getConfiguration();
}catch (error){
  logger().error("Could not get configuration:", error)
}

app.get('/api/dashboard', (req, res) => {
  if(configuration) {
    res.send(configuration.dashboardConfig);
  } else {
    const errorMessage = "Dashboard config not defined.";
    logger().error(errorMessage);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(createBackendError(errorMessage));
  }
});

app.post('/api/dashboard/action', (req, res) => {
  executeAction(req.body)
      .then(displayUpdate => res.status(HttpStatusCode.ACCEPTED).send(displayUpdate))
      .catch(error => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(JSON.stringify(error)));
});

app.post('/api/dashboard/health-check', (req, res) => {
  healthCheckService().checkUrl(req.body)
      .then(status => res.status(200).send({status: status}));
});

configureCronjob(configuration?.cronjobConfig);

const port = 8080;

app.listen(port, () => logger().info(`Server started on port ${port}`));
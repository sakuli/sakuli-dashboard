import express from 'express'
import { join } from 'path'
import { executeAction } from "./service/action.service";
import { HttpStatusCode } from "@sakuli-dashboard/api";
import { healthCheckService } from "./service/health-check.service";
import { getConfiguration } from "./functions/get-configuration.function";
import { configureCronjob } from "./service/cronjob.service";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));
app.use(express.json());

app.get('/api/dashboard', (req, res) => {
  try {
    res.send(getConfiguration().dashboardConfig);
  } catch (e) {
    console.error("Failed to get dashboard config", e);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
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

try{
  configureCronjob(getConfiguration().cronjobConfig);
} catch (e) {
  console.log("Failed to configure cronjob", e);
}

const port = 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
import express from 'express'
import { join } from 'path'
import { executeAction } from "./service/action.service";
import { HttpStatusCode } from "@sakuli-dashboard/api";
import { healthCheckService } from "./service/health-check.service";
import getConfig from "./service/config.service";
import { DashboardActionsConfig } from "./config/dashboard-actions.config";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));
app.use(express.json());

app.get('/api/dashboard', (req, res) => {
  try {
    const dashboardConfig:DashboardActionsConfig = getConfig(process.env.DASHBOARD_CONFIG);
    res.send(dashboardConfig);
  } catch (e) {
    console.error("Failed to get DASHBOARD_CONFIG", e);
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

const port = 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
import express from 'express'
import { join } from 'path'
import HttpStatusCode from "./api/HttpStatusCode";
import { DashboardActionRequest } from "./api/dashboard-action-request.interface";
import { ClusterAction, DashboardActionsConfig } from './config/dashboard-actions.config';
import { getDashboardConfig } from "./service/dashboard-config.service";
import { executeAction } from "./service/action.service";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));
app.use(express.json());

app.get('/api/dashboard', (req, res) => {
  res.send(getDashboardConfig());
});

app.post('/api/dashboard/action', (req, res) => {
  executeAction(req.body)
      .then(action => res.status(HttpStatusCode.ACCEPTED).send(action))
      .catch(error => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
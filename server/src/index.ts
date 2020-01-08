import express from 'express'
import { join } from 'path'
import HttpStatusCode from "./api/HttpStatusCode";
import { getDashboardConfig } from "./service/dashboard-config.service";
import { executeAction } from "./service/action.service";
import { DashboardConfigResponse } from "./api/dashboard-config-response.interface";
import { checkPod } from "./service/check-pod.service";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));
app.use(express.json());

app.get('/api/dashboard', (req, res) => {
  res.send(<DashboardConfigResponse> getDashboardConfig());
});

app.post('/api/dashboard/action', (req, res) => {
  executeAction(req.body)
      .then(displayUpdate => res.status(HttpStatusCode.ACCEPTED).send(displayUpdate))
      .catch(error => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error));
});

app.post('/api/dashboard/checkPod', (req, res) => {
  checkPod(req.body.url)
      .then(status => res.status(200).send({status: status}));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
import express from 'express'
import { join } from 'path'
import HttpStatusCode from "./api/HttpStatusCode";
import { DashboardConfigResponse } from "./api/dashboard-config-response.interface";
import { DashboardActionRequest } from "./api/dashboard-action-request.interface";
import { ClusterAction, DashboardActionsConfig } from './config/dashboard-actions.config';

const app = express();

app.use(express.static(join(__dirname, '../../dist')));
app.use(express.json());

app.get('/api/dashboard', (req, res) => {
  res.send(<DashboardConfigResponse> JSON.parse(process.env.DASHBOARD_CONFIG || "{}"));
});

app.post('/api/dashboard/action', (req, res) => {
  const actionConfig = process.env.ACTION_CONFIG;
  if(!actionConfig){
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Environment variable 'ACTION_CONFIG' not set.");
  }

  const buttonActionRequest: DashboardActionRequest = req.body;
  const actionToPerform: ClusterAction | undefined = (<DashboardActionsConfig> JSON.parse(actionConfig || "{}"))
          .actions
          .find(action => action.actionIdentifier === buttonActionRequest.actionIdentifier);
  if(actionToPerform){
    //TODO: Replace with k8s magic
    res.status(HttpStatusCode.ACCEPTED).send(buttonActionRequest);
  }else{
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(`Requested action '${buttonActionRequest.actionIdentifier}' not found.`)
  }
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
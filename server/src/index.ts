import express from 'express'
import { join } from 'path'
import { DashboardResponse } from "./api/dashboard-response.interface";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));

app.get('/api/dashboard', (req, res) => {
  res.send(<DashboardResponse> JSON.parse(process.env.DASHBOARD_CONFIG || "{}"));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
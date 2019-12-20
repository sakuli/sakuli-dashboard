import express from 'express'
import { join } from 'path'
import { DisplaysResponse } from "./api/displays-response.interface";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));

app.get('/api/displays', (req, res) => {
  res.send(<DisplaysResponse>[
    {
      url: "https://localhost:8443/demo/grafana/dashboard/script/histou.js?orgId=1&host=sakuli_client&service=integrationtest_Testcase&theme=light&annotations=true&refresh=30s&from=1576732889281&to=1576761689281&var-Case=All"
    }
  ]);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
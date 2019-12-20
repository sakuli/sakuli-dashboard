import express from 'express'
import { join } from 'path'
import { DisplaysResponse } from "./api/displays-response.interface";

const app = express();

app.use(express.static(join(__dirname, '../../dist')));

app.get('/api/displays', (req, res) => {
  res.send(<DisplaysResponse> JSON.parse(process.env.DISPLAYS_CONFIG || "[]"));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
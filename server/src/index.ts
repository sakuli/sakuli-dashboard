import express, { json } from 'express'
import { join } from 'path'
const app = express();

app.use(express.static(join(__dirname, '../../dist')));


const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
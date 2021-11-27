import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });
import config from './config';

import express from 'express';
import { IAPIRequestLogger } from "./lib/APIRequestLogger/IAPIRequestLogger";
import { AzureTableAPIRequestLogger } from "./lib/APIRequestLogger/AzureTableApiRequestLogger";

const OnRequestReceived = async (request: any, result: any, next: any) => {

  try {
    const { partition } = request.query;

    const requestLog = {
      Method: request.method,
      Headers: request.headers,
      Body: request.body
    }

    const apiLogger: IAPIRequestLogger = new AzureTableAPIRequestLogger(config.Azure);
    await apiLogger.LogRequestAsync(requestLog, partition);

    console.log(requestLog);

    result.sendStatus(200);
  }
  catch (err) {
    next(err);
  }
};


const app = express();

app.get('/', OnRequestReceived);
app.post('/', OnRequestReceived);
app.put('/', OnRequestReceived);
app.patch('/', OnRequestReceived);
app.delete('/', OnRequestReceived);
app.options('/', OnRequestReceived);

app.get('/app', (req, res) => res.sendFile(__dirname + '/index.html'));


app.listen(config.Express.Port, () => {
  console.log(`[server]: Request bin is running at https://localhost:${config.Express.Port}`);
});



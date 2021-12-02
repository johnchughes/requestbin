import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

import config from './config';
import express from 'express';
import bodyParser from "body-parser";
import { IAPIRequestLogger } from "./lib/APIRequestLogger/IAPIRequestLogger";
import { AzureTableAPIRequestLogger } from "./lib/APIRequestLogger/AzureTableApiRequestLogger";
import { LocalDiskApiRequestLogger } from "./lib/APIRequestLogger/LocalDiskApiRequestLogger";

const OnRequestReceived = async (request: any, result: any, next: any) => {

  try {

    const partition = request.params.partition;

    const base64Body = btoa(request.body);

    const requestLog = {
      Method: request.method,
      Headers: request.headers,
      Body: base64Body
    }

    //TODO: Move out to factory
    let apiLogger: IAPIRequestLogger;
    if (config.RequestBinConfig.StorageMechanism === 'AzureTable') {
      apiLogger = new AzureTableAPIRequestLogger(config.Azure);
    } else {
      apiLogger = new LocalDiskApiRequestLogger(config.LocalDisk);
    }

    await apiLogger.LogRequestAsync(requestLog, partition);

    result.sendStatus(200);
  }
  catch (err) {
    next(err);
  }

};

const app = express();
app.use(bodyParser.text({type: "*/*"}));

const BIN_URL_FORMAT: string = "/:partition";

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));


app.get(BIN_URL_FORMAT, OnRequestReceived);
app.post(BIN_URL_FORMAT, OnRequestReceived);
app.put(BIN_URL_FORMAT, OnRequestReceived);
app.patch(BIN_URL_FORMAT, OnRequestReceived);
app.delete(BIN_URL_FORMAT, OnRequestReceived);
app.options(BIN_URL_FORMAT, OnRequestReceived);


app.listen(config.Express.Port, () => {
  console.log(`Storage Mechanism => ${config.RequestBinConfig.StorageMechanism}`)
  console.log(`[server]: Request bin is running at https://localhost:${config.Express.Port}`);
});



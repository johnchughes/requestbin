import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

import * as fs from 'fs';
import * as path from 'path';
import config from './config';
import express from 'express';
import bodyParser from "body-parser";
import { IAPIRequestLogger } from "./lib/APIRequestLogger/IAPIRequestLogger";
import { AzureTableAPIRequestLogger } from "./lib/APIRequestLogger/AzureTableApiRequestLogger";
import { LocalDiskApiRequestLogger } from "./lib/APIRequestLogger/LocalDiskApiRequestLogger";
import rateLimit from 'express-rate-limit';

const OnRequestReceived = async (request: any, result: any, next: any) => {

  try {

    const partition = request.params.partition;
    const base64Body = Buffer.from(request.body, 'base64');
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

//TODO: make this configurable. 
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true
});

app.use(rateLimiter);
app.use(bodyParser.text({type: "*/*"}));

const BIN_URL_FORMAT: string = "/bin/:partition";

//App/API routes
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/api/requests', async (req, res) => {

  let requestBins : any = [];

  const baseDir = path.resolve(config.LocalDisk.BaseDir);
  var directrories = await fs.readdirSync(baseDir);
  for(var dir of directrories){

    let files = await fs.readdirSync(baseDir + '/' + dir);
    let directoryEntry : any = {
      "root": dir,
      "files": files
    };
    requestBins.push(directoryEntry);

  }

  const requestBinResponse : any = {
    Date: Date.now(),
    Bins: requestBins
  };

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(requestBinResponse));
});

app.get('api/requests/:itempath', (req, res) => {
  res.sendStatus(200);
});


//Logging Routes
app.get(BIN_URL_FORMAT, OnRequestReceived);
app.post(BIN_URL_FORMAT, OnRequestReceived);
app.put(BIN_URL_FORMAT, OnRequestReceived);
app.patch(BIN_URL_FORMAT, OnRequestReceived);
app.delete(BIN_URL_FORMAT, OnRequestReceived);
app.options(BIN_URL_FORMAT, OnRequestReceived);


app.listen(config.Express.Port, () => {
  console.log(`Storage Mechanism => ${config.RequestBinConfig.StorageMechanism}`)
  console.log(`[server]: Request bin is running at http://localhost:${config.Express.Port}`);
});



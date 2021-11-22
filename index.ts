import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });
import config from './config';

import express from 'express';
import * as azure from 'azure-storage';

const OnRequestReceived = async (request : any, result : any) => {

    const { partition } = request.query;

    const requestLog = {
        Method: request.method,
        Headers: request.headers,
        Body: request.body
    }

    let tableSvc;
    try{
        tableSvc = await azure.createTableService(config.Azure.AccountName, config.Azure.AccessKey);
    }
    catch(err){
        throw err;
    }
    
    await tableSvc.createTableIfNotExists(config.Azure.TableName, (error,result,response) => {
        if(error) {
            throw error;
        }

    });

    const entGen = azure.TableUtilities.entityGenerator;
    const task = {
        PartitionKey: entGen.String(partition),
        RowKey: entGen.String(new Date().getTime().toString()),
        Method: requestLog.Method,
        Request: entGen.String(JSON.stringify(requestLog))
    };

    tableSvc.insertEntity(config.Azure.TableName, task, (error, result, response) => {
        if(error){
            console.log(result);
            console.log(response);
            throw result;
        }
    })

    console.log(requestLog);

    result.sendStatus(200);
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



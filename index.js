const express = require("express");
const path = require('path');
const azure  =  require('azure-storage');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
const url = require('url');

const PORT = process.env.PORT;

const AzureConfig = {
    ConnectionString: process.env.AZURE_STORAGE_ACCESS_KEY,
    AccountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    TableName: process.env.AZURE_STORAGE_TABLE_NAME
};


const app = express();
app.use(express.json());

const CreateCommonLogObject = (request) => {
    let requestLog = {
        Method: request.method,
        Headers: request.headers,
        Body: request.body
    }
    return requestLog;
}

const accessKey = AzureConfig.ConnectionString;
const accountName = AzureConfig.AccountName;
const tableName = AzureConfig.TableName;

const TableInsert = async (partition, obj) => {
    let tableSvc;
    try{
        tableSvc = await azure.createTableService(accountName, accessKey);
    }
    catch(err){
        throw err;
    }
    
    await tableSvc.createTableIfNotExists(tableName, function(error,result,response) {
        if(error) {
            throw error;
        }

    });

    const entGen = azure.TableUtilities.entityGenerator;
    const task = {
        PartitionKey: entGen.String(partition),
        RowKey: entGen.String(new Date().getTime().toString()),
        Request: entGen.String(JSON.stringify(obj))
    };

    tableSvc.insertEntity(tableName, task, (error, result, response) => {
        if(error){
            console.log(result);
            console.log(response);
            throw result;
        }
    })

}

const RequestLogger = async (req, res) => {

    const queryObject = url.parse(req.url,true).query;
    const partition = queryObject.p;

    try
    {
        let entity = CreateCommonLogObject(req);
        entity.body = res.body;
        await TableInsert(partition,entity);
        console.log((new Date()).toUTCString() + ' - 200 OK');
        return res.sendStatus(200);
    }
    catch(err) {
        console.log((new Date()).toUTCString()  + ' - 500 Error');
        console.log(err);
        return res.sendStatus(500);
    }
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('/app', async (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/', RequestLogger);
app.post('/', RequestLogger);
app.put('/', RequestLogger);
app.patch('/', RequestLogger);


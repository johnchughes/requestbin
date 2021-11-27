import { AzureConfig } from "../AppConfig/AppConfig";
import * as azure from 'azure-storage';
import { IAPIRequestLogger } from "./IAPIRequestLogger";


class AzureTableAPIRequestLogger implements IAPIRequestLogger
{
    TableConfig : AzureConfig;

    constructor(AzureConfig : AzureConfig) {
        this.TableConfig = AzureConfig;
    }

    async LogRequestAsync(RequestData: any, Partition : string) : Promise<void> {
        let tableSvc;
    try{
        tableSvc = await azure.createTableService(this.TableConfig.AccountName, this.TableConfig.AccessKey);
    }
    catch(err){
        throw err;
    }
    
    await tableSvc.createTableIfNotExists(this.TableConfig.TableName, (error,result,response) => {
        if(error) {
            throw error;
        }

    });

    const entGen = azure.TableUtilities.entityGenerator;
    const task = {
        PartitionKey: entGen.String(Partition),
        RowKey: entGen.String(new Date().getTime().toString()),
        Method: RequestData.Method,
        Request: entGen.String(JSON.stringify(RequestData))
    };

    tableSvc.insertEntity(this.TableConfig.TableName, task, (error, result, response) => {
        if(error){
            console.log(result);
            console.log(response);
            throw result;
        }
    })
    }
    
}

export {AzureTableAPIRequestLogger}
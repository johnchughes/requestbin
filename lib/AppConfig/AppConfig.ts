class AppConfig {

    constructor(env : any)
    {
        this.Express = { Port: env.Express.Port}
        this.Azure =  {AccessKey: env.Azure.AccessKey, TableName: env.Azure.TableName, AccountName: env.Azure.AccountName};
    }

    Express: ExpressConfig;
    Azure: AzureConfig;
}

interface ExpressConfig {
    Port: number
}

interface AzureConfig {
    AccessKey: string,
    TableName: string,
    AccountName: string
}

export {AppConfig, ExpressConfig, AzureConfig};
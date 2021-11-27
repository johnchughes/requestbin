class AppConfig {

    constructor(env : any)
    {
        this.Express = { Port: env.Express.Port}
        this.Azure =  {AccessKey: env.Azure.AccessKey, TableName: env.Azure.TableName, AccountName: env.Azure.AccountName};
        this.LocalDisk = {BaseDir: env.LocalDisk.BaseDir}
    }

    Express: ExpressConfig;
    Azure: AzureConfig;
    LocalDisk : LocalDiskConfig;
}

interface ExpressConfig {
    Port: number
}

interface AzureConfig {
    AccessKey: string,
    TableName: string,
    AccountName: string
}

interface LocalDiskConfig {
    BaseDir: string
}

interface RequestBinConfig {
    StorageMechanism: string
}

export {AppConfig, ExpressConfig, AzureConfig, LocalDiskConfig, RequestBinConfig};
export default {
    Express: {
        Port: process.env.PORT ?? 6060
    },
    Azure: {
        AccessKey: process.env.AZURE_STORAGE_ACCESS_KEY ?? '',
        AccountName: process.env.AZURE_STORAGE_ACCOUNT_NAME ?? '',
        TableName: process.env.AZURE_STORAGE_TABLE_NAME ?? ''
    },
    LocalDisk: {
        BaseDir: process.env.LOCAL_DISK_BASE_DIR ?? './Requests'
    },
    RequestBinConfig: {
        StorageMechanism: process.env.STORAGE_MECHANISM ?? 'LocalDisk'
    }

}
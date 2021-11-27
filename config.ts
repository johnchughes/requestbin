export default {
    Express: {
        Port: process.env.PORT
    },
    Azure: {
        AccessKey: process.env.AZURE_STORAGE_ACCESS_KEY ?? '',
        AccountName: process.env.AZURE_STORAGE_ACCOUNT_NAME ?? '',
        TableName: process.env.AZURE_STORAGE_TABLE_NAME ?? ''
    }
}
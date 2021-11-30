# requestbin

This project is a dumb request bin, all it will do is take API requests log some information and return OK. Its purpose is for use in development systems allowing the system to send the API request and for the developer to view what was sent. While there are hosted services out there that will generate an API to send data to the point of this is that the developer can control where the data goes reducing sensitive information being sent to other services. 

Currently the project only supports sending data to an Azure Table Storage, but it would be fairly simple to extend to use the local storage instead. 



## How to run

Install node js, once installed install yarn

```
npm install -g yarn
```

clone the repo and open a terminal in the requestbin repository and run

```
yarn install
```

Create a file called .env with the following content

```
PORT=3000
STORAGE_MECHANISM=
AZURE_STORAGE_ACCESS_KEY=
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_TABLE_NAME=
LOCAL_DISK_BASE_DIR=
```

Populate the value for each property. 

Supported Storage Mechanism values:
 - AzureTable
   - requires  azure_storage_* variables to be populated
 - LocalDisk
   - requires LOCAL_DISK_* variables to be populated

run 

```
yarn start
```

send requests.

# requestbin

RequestBin is a dump API that will take any requests and log them to a configured storage mechanism, two mechanisms are currently supported Local Disk and Azure Table Storage. 

The idea behind this project is to facilitate local development where you may be developing against an external API but for what ever reason you cant hit that API yet, so instead you can point your code at the requestbin endpoint and still send a request without hitting any actual endpoints. RequestBin allows you to view the headers and data sent, there are online tools available that do similar things but the point of this project is you get to choose where the data is stored.



## Setup

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


# Running RequestBin

in a termainl navigate to the requestbin directory and run

```
yarn start
```

A web server will be started running at ```http://localhost:<PORT>```

If you open a browser and navigate to the above URL it will load the application for viewing recieved requests (TODO).

To log requests then add a URL paramter to the requests in the format of ```http://localhost<PORT>/<BinName>```, requests will be logged and stored in a directory or partition by the name provided as the URL parameter. 

 if you send used the BinName 'myAPI' and had the LocalDisk storage mechanism configured in your local disk base directory you will find a folder called 'myAPI'and a json file containing details of that request. 
 If using azure table storage then the partition name will be the BinName. 

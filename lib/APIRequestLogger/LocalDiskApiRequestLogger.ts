
import   *   as fs from "fs";
import path from "path/posix";
import { LocalDiskConfig } from "../AppConfig/AppConfig";
import { IAPIRequestLogger } from "./IAPIRequestLogger";

 class LocalDiskApiRequestLogger implements IAPIRequestLogger {


    localDiskConfig : LocalDiskConfig;

    constructor(LocalDiskConfig : LocalDiskConfig) {
        this.localDiskConfig = LocalDiskConfig;
    }

     async LogRequestAsync(RequestData: any, Partition: string): Promise<void> {
         
        const date = new Date();
        const date_string = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getMilliseconds()}`;
        const directory = `${this.localDiskConfig.BaseDir}/${Partition}`;

        if(!fs.existsSync(directory)) {
            await fs.mkdirSync(directory, { recursive: true });
        }

        const file_path : string = `${directory}/${RequestData.Method}_${date_string}.json`;

        const file_content = JSON.stringify(RequestData);   
        var writer = fs.createWriteStream(file_path);
        writer.write(JSON.stringify(file_content));
        writer.close();
     }

 }

 export {LocalDiskApiRequestLogger};
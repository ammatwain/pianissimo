import OS from "os";
import FS from "fs";
import PATH from "path";
import { Package } from "../Package";

export class Config {
    public static get HomeDir(): string {
        const homeDir = PATH.resolve(OS.homedir(),`.${Package.name}`);
        if (!FS.existsSync(homeDir)) {
            FS.mkdirSync(homeDir);
        } 
        return homeDir;
    }

    public static get ConfigFile(): string {
        return PATH.resolve(Config.HomeDir,"config.json");
    }
    
}
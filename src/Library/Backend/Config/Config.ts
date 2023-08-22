import OS from "os";
import FS from "fs";
import PATH from "path";
import { Package } from "../Package";

class _Config {
    constructor() {
        if (!FS.existsSync(this.HomeDir)) {
            FS.mkdirSync(this.HomeDir);
        }

        if (!FS.existsSync(this.ConfigFile)) {
            FS.writeFileSync(this.ConfigFile, JSON.stringify(_Config.configDefault));
        }

        this.config = FS.readFileSync(this.ConfigFile).toJSON();

    }

    private static configDefault: {[index: string]: any} = {
        database: `./${Package.name}.db`,
    };

    private config: any = {};

    public saveConfig(): void {
        FS.writeFileSync(this.ConfigFile, JSON.stringify(this.config, null, 2));
    }

    public get HomeDir(): string {
        return PATH.resolve(OS.homedir(),`.${Package.name}`);
    }

    public get ConfigFile(): string {
        return PATH.resolve(this.HomeDir,"config.json");
    }

    private getKeyValue(key: string): any {
        return this.config[key] || _Config.configDefault[key];
    }

    private setKeyValue(key: string, value: any): void {
        if (this.config[key] !== value) {
            this.config[key] = value;
            this.saveConfig();
        }
    }

    public get Database(): string{
        let database: string = this.getKeyValue("database");
        database = PATH.resolve(this.HomeDir, database);
        return database;
    }

    public set Database(database: string){
        database = database.replace(`${this.HomeDir}/`,"./");
        this.setKeyValue("database", database);
    }
}

export const Config: _Config  = new _Config();

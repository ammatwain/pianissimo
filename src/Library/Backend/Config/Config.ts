import OS from "os";
import FS from "fs";
import PATH from "path";
import { Package } from "@Backend/Package";

class _Config {
    constructor() {
        if (!FS.existsSync(this.HomeDir)) {
            FS.mkdirSync(this.HomeDir);
        }

        if (!FS.existsSync(this.ConfigFile)) {
            this.config = _Config.configDefault;
            this.saveConfig();
        } else {
            this.config = this.loadConfig();
        }
    }

    private static configDefault: {[index: string]: any} = {
        "database": `./${Package.name}.db`,
        "libraryName": "Piano Library",
    };

    private config: any = {};

    public loadConfig(): any {
        return JSON.parse(FS.readFileSync(this.ConfigFile).toString("utf-8"));
    }

    public saveConfig(): void {
        FS.writeFileSync(this.ConfigFile, JSON.stringify(this.config, null, 2));
    }

    public get HomeDir(): string {
        return PATH.resolve(OS.homedir(),`.${Package.name}`);
    }

    public get ConfigFile(): string {
        return PATH.resolve(this.HomeDir,"config.json");
    }

    public getKeyValue(key: string): string {
        return this.config[key] || _Config.configDefault[key];
    }

    public setKeyValue(key: string, value: any): void {
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
        throw new Error("SET DATABASE");
        database = database.replace(`${this.HomeDir}/`,"./");
        this.setKeyValue("database", database);
    }

    public get LibraryName(): string{
        return this.getKeyValue("libraryName") || _Config.configDefault.libraryName;
    }

    public set LibraryName(libraryName: string){
        this.setKeyValue("libraryName", libraryName);
    }

}

export const Config: _Config  = new _Config();

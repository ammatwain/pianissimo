import FS from "fs";
import BetterSqlite3 from "better-sqlite3";
import zlib from "zlib";

export type StoreOptions = BetterSqlite3.Options;

export class Store {
    private db: BetterSqlite3.Database;
    constructor(dbFileName: string, dbOptions: StoreOptions) {
        this.db = new BetterSqlite3(dbFileName, dbOptions);
        this.registerFunctionParse();
        this.registerFunctionStringify();
        this.registerFunctionUploadFile();
        this.registerFunctionDownloadFile();
    }

    private registerFunctionParse(): void {
        this.Db.function("PARSE", (stringified: string): any => {
            return JSON.parse(stringified) || null;
        });
    }

    private registerFunctionStringify(): void {
        this.Db.function("STRINGIFY", (parsed: any): string => {
            return JSON.stringify(parsed) || null;
        });
    }

    private registerFunctionUploadFile(): void {
        //var deflated = zlib.deflateSync(input).toString('base64');
        //var inflated = zlib.inflateSync(new Buffer(deflated, 'base64')).toString();
        this.Db.function("UPLOADFILE", (filename: string): Buffer => {
            if (FS.existsSync(filename)){
                return zlib.deflateRawSync(FS.readFileSync(filename));
            }
            return null;
        });
    }

    private registerFunctionDownloadFile(): void {
        //var deflated = zlib.deflateSync(input).toString('base64');
        //var inflated = zlib.inflateSync(new Buffer(deflated, 'base64')).toString();
        this.Db.function("DOWNLOADFILE", (data: Buffer): Buffer => {
            return zlib.inflateRawSync(data);
        });
    }

    public get Db(): BetterSqlite3.Database {
        return this.db;
    }

    public exec(sql: string): BetterSqlite3.Database {
        return this.Db.exec(sql);
    }

    public prepare(sql: string): BetterSqlite3.Statement<unknown[]> {
        return this.Db.prepare(sql);
    }
}

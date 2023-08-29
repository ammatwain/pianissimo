import { globSync } from "glob";
import md5file from "md5-file";
import { Store, StoreOptions } from "../Store";
import { Walk } from "../Walk";
import { SqlQuery } from "../Letture/Queries";
import { IBranchObject } from "../../Common/Interfaces/IBranchObject";
//import { Config } from "../Config";

export class Letture extends Store {
    constructor (dbFileName: string, dbOptions: StoreOptions = { verbose: console.warn}) {
        super(dbFileName, dbOptions);
        this.Db.exec(SqlQuery.CreateTableLibrary);
        /*
        this.Db.table("homedir", {
            columns: ["id","path"],
            rows: function* () {
                for (let path of globSync(`${Config.HomeDir}/ ** /*.{musicxml,xml}`)) {
                    //const data = fs.readFileSync(filename);
                    const id: string = md5file.sync(path);
                    path = path.replace(`${Config.HomeDir}/`,"");
                    yield { id, path };
                }
            },
        });
        */
    }

    getLinearLibrary(): IBranchObject[] {
        const library: IBranchObject[] = <IBranchObject[]>this.prepare(SqlQuery.SelectTableLibrary).all();
        library.forEach((branchObject: IBranchObject)=>{
            if (typeof branchObject.custom === "string") {
                branchObject.custom = JSON.parse(branchObject.custom) || {};
            }
        });
        return library;
        //return <IBranchObject[]>this.prepare(SqlQuery.SelectTableLibrary).all();
    }

    getTreeLibrary(): IBranchObject[] {
        const walk: IBranchObject[] = new Walk(this.getLinearLibrary()).TreeObjects;
        return walk;
    }

}

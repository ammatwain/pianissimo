import  { Store, StoreOptions } from "../Store";
import  { Walk } from "../../Backend";
import  { SqlQuery } from "./Queries";
import { IBranchObject } from "../../Common";

export class Letture extends Store {

    constructor (dbFileName: string, dbOptions: StoreOptions = { verbose: console.warn}) {
        super(dbFileName, dbOptions);
        this.Db.exec(SqlQuery.CreateTableLibrary);
    }

    getLinearLibrary(): IBranchObject[] {
        const library: IBranchObject[] = <IBranchObject[]>this.prepare(SqlQuery.SelectTableLibrary).all();
        library.forEach((branch: IBranchObject)=>{
            if (typeof branch.custom === "string") {
                branch.custom = JSON.parse(branch.custom) || {};
            }
        });
        return <IBranchObject[]>this.prepare(SqlQuery.SelectTableLibrary).all();

    }

    getTreeLibrary(): IBranchObject[] {
        const walk = new Walk(this.getLinearLibrary()).TreeObjects;
        return walk;
    }

}

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

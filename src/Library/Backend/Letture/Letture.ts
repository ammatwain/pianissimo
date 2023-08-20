import  { Store, StoreOptions } from "../Store";
import  { IBranchObject, Walk } from "../../Backend";
import  { SqlQuery } from "./Queries";

export class Letture extends Store {

    constructor (dbFileName: string, dbOptions: StoreOptions = { verbose: console.warn}) {
        super(dbFileName, dbOptions);
        this.Db.exec(SqlQuery.CreateTableLibrary);
    }

    getLinearLibrary(): IBranchObject[] {
        return <IBranchObject[]>this.prepare(SqlQuery.SelectTableLibrary).all();
    }

    getTreeLibrary(): IBranchObject[] {
        const walk = new Walk(this.getLinearLibrary()).TreeObjects;
        return walk;
    }

}

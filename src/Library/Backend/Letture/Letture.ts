import { globSync } from "glob";
import md5file from "md5-file";
import { Store, StoreOptions } from "@Backend/Store";
import { Walk } from "@Library/Common/Walk";
import { SqlQuery } from "@Backend/Letture/Queries";
import { IBranchObject } from "@Interfaces/IBranchObject";
import { STR } from "@Library/Global/STR";
import { TDBRackObject, TRackObject } from "@DataObjects/TRackObject";
import { TDBScoreObject, TDBSheetObject, TScoreObject, TSheetObject } from "@Library/Common/DataObjects";
//import { Config } from "../Config";

export class Letture extends Store {
    constructor (dbFileName: string, dbOptions: StoreOptions = { verbose: console.warn}) {
        super(dbFileName, dbOptions);
        this.Db.exec(SqlQuery.CreateTableLibrary);
        this.Db.exec(SqlQuery.CreateTableDiary);
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
            if (typeof branchObject.custom === STR.string) {
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

    getRackObject(dbRackObject: TDBRackObject): TRackObject {
        return {
            rackId: Number(dbRackObject.rackId),
            parentRackId: Number(dbRackObject.parentRackId) || 0,
            sequence: Number(dbRackObject.sequence) || 0,
            status: JSON.parse(dbRackObject.status),
            title: dbRackObject.title,
        };
    }

    getDbRackObject(rackObject: TRackObject): TDBRackObject {
        return {
            rackId: Number(rackObject.rackId),
            parentRackId: Number(rackObject.parentRackId) || 0,
            sequence: Number(rackObject.sequence) || 0,
            status: JSON.stringify(rackObject.status),
            title: rackObject.title,
        };
    }

    getRack(rackId: number): TRackObject {
        const dbRack: TDBRackObject = <TDBRackObject>this.prepare(`SELECT * FROM "racks" where "rackId"=${rackId};`).get();
        console.log(dbRack);
        return this.getRackObject(dbRack);
    }

    getRacks(): TRackObject[] {
        const rackObjects: TRackObject[] = [];
        const dbRacks: TDBRackObject[] = <TDBRackObject[]>this.prepare("SELECT * FROM \"racks\" ORDER BY \"parentRackId\" ASC,\"sequence\" ASC;").all();
        dbRacks.forEach((dbRack: TDBRackObject)=>{
            rackObjects.push(this.getRackObject(dbRack));
        });
        return rackObjects;
    }

    getScoreObject(dbScoreObject: TDBScoreObject): TScoreObject {
        return {
            scoreId: Number(dbScoreObject.scoreId),
            parentRackId: Number(dbScoreObject.parentRackId) || 0,
            sequence: Number(dbScoreObject.sequence) || 0,
            status: JSON.parse(dbScoreObject.status),
            title: dbScoreObject.title,
            subtitle: dbScoreObject.subtitle,
            author: dbScoreObject.author,
            measures: Number(dbScoreObject.measures) || 0,
            parts: JSON.parse(dbScoreObject.parts),
            mainKey: Number(dbScoreObject.mainKey) || 0,
            mainTempo: JSON.parse(dbScoreObject.mainTempo),
        };
    }

    getDbScoreObject(scoreObject: TScoreObject): TDBScoreObject {
        return {
            scoreId: Number(scoreObject.scoreId),
            parentRackId: Number(scoreObject.parentRackId) || 0,
            sequence: Number(scoreObject.sequence) || 0,
            status: JSON.stringify(scoreObject.status),
            title: scoreObject.title,
            subtitle: scoreObject.subtitle,
            author: scoreObject.author,
            measures: Number(scoreObject.measures),
            parts: JSON.stringify(scoreObject.parts),
            mainKey: Number(scoreObject.mainKey),
            mainTempo: JSON.stringify(scoreObject.mainTempo),
        };
    }

    getScore(scoreId: number): TScoreObject {
        const dbScore: TDBScoreObject = <TDBScoreObject>this.prepare(`SELECT * FROM "scores" where "scoreId"=${scoreId};`).get();
        return this.getScoreObject(dbScore);
    }

    setScore(scoreObject: TScoreObject): TScoreObject {
        const score: TDBScoreObject = this.getDbScoreObject(scoreObject);
        this.exec(`
            REPLACE INTO "scores" (
                "scoreId",
                "parentRackId",
                "sequence",
                "status",
                "title",
                "subtitle",
                "author",
                "measures",
                "parts",
                "mainKey",
                "mainTempo"
            ) VALUES (
                '${score.scoreId}',
                '${score.parentRackId}',
                '${score.sequence}',
                '${score.status}',
                '${score.title}',
                '${score.subtitle}',
                '${score.author}',
                '${score.measures}',
                '${score.parts}',
                '${score.mainKey}',
                '${score.mainTempo}'
            );
        `);
        return this.getScore(score.scoreId);
    }

    getScores(): TScoreObject[] {
        const scoreObjects: TScoreObject[] = [];
        const dbScores: TDBScoreObject[] = <TDBScoreObject[]>this.prepare("SELECT * FROM \"scores\" ORDER BY \"parentRackId\" ASC,\"sequence\" ASC;").all();
        dbScores.forEach((dbScore: TDBScoreObject)=>{
            scoreObjects.push(this.getScoreObject(dbScore));
        });
        return scoreObjects;
    }

    getSheetObject(dbSheetObject: TDBSheetObject): TSheetObject {
        return {
            sheetId: Number(dbSheetObject.sheetId),
            parentScoreId: Number(dbSheetObject.parentScoreId) || 0,
            sequence: Number(dbSheetObject.sequence) || 0,
            status: JSON.parse(dbSheetObject.status),
            title: dbSheetObject.title,
            subtitle: dbSheetObject.subtitle,
            practiceKeys: JSON.parse(dbSheetObject.practiceKeys),
            activeKey: Number(dbSheetObject.activeKey) || 0,
            measureStart: Number(dbSheetObject.measureStart),
            measureEnd: Number(dbSheetObject.measureStart),
            selectedParts: JSON.parse(dbSheetObject.selectedParts),
            transposeSettings: JSON.parse(dbSheetObject.transposeSettings),
            shot: JSON.parse(dbSheetObject.shot),
            done: JSON.parse(dbSheetObject.done),
            loop: JSON.parse(dbSheetObject.loop),
        };
    }

    getDbSheetObject(sheetObject: TSheetObject): TDBSheetObject {
        return {
            sheetId: Number(sheetObject.sheetId),
            parentScoreId: Number(sheetObject.parentScoreId) || 0,
            sequence: Number(sheetObject.sequence) || 0,
            status: JSON.stringify(sheetObject.status),
            title: sheetObject.title,
            subtitle: sheetObject.subtitle,
            practiceKeys: JSON.stringify(sheetObject.practiceKeys),
            activeKey: Number(sheetObject.activeKey) || 0,
            measureStart: Number(sheetObject.measureStart),
            measureEnd: Number(sheetObject.measureStart),
            selectedParts: JSON.stringify(sheetObject.selectedParts),
            transposeSettings: JSON.stringify(sheetObject.transposeSettings),
            shot: JSON.stringify(sheetObject.shot),
            done: JSON.stringify(sheetObject.done),
            loop: JSON.stringify(sheetObject.loop),
        };
    }

    getSheet(sheetId: number): TSheetObject {
        const dbSheet: TDBSheetObject = <TDBSheetObject>this.prepare(`SELECT * FROM "sheets" where "sheetId"=${sheetId};`).get();
        return this.getSheetObject(dbSheet);
    }

    setSheet(sheetObject: TSheetObject): TSheetObject {
        const sheet: TDBSheetObject = this.getDbSheetObject(sheetObject);
        this.exec(`
            REPLACE INTO "sheets" (
                "sheetId",
                "parentScoreId",
                "sequence",
                "status",
                "title",
                "subtitle",
                "practiceKeys",
                "activeKey",
                "measureStart",
                "measureEnd",
                "selectedParts",
                "transposeSettings",
                "shot",
                "done",
                "loop"
            ) VALUES (
                '${sheet.sheetId}',
                '${sheet.parentScoreId}',
                '${sheet.sequence}',
                '${sheet.status}',
                '${sheet.title}',
                '${sheet.subtitle}',
                '${sheet.practiceKeys}',
                '${sheet.activeKey}',
                '${sheet.measureStart}',
                '${sheet.measureEnd}',
                '${sheet.selectedParts}',
                '${sheet.transposeSettings}',
                '${sheet.shot}',
                '${sheet.done}',
                '${sheet.loop}'
            );`
        );
        return this.getSheet(sheet.sheetId);
    }

    getSheets(): TSheetObject[] {
        const sheetObjects: TSheetObject[] = [];
        const dbSheets: TDBSheetObject[] = <TDBSheetObject[]>this.prepare("SELECT * FROM \"sheets\" ORDER BY \"parentScoreId\" ASC,\"sequence\" ASC;").all();
        dbSheets.forEach((dbSheet: TDBSheetObject)=>{
            sheetObjects.push(this.getSheetObject(dbSheet));
        });
        return sheetObjects;
    }

}

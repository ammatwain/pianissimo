import { Store, StoreOptions } from "@Backend/Store";
import { SqlQuery } from "@Backend/Letture/Queries";
import { TDBRackObject, TRackObject } from "@DataObjects/TRackObject";
import { TDBScoreObject, TDBSheetObject, TDBZippedObject, THiddenPart, TMusicXmlObject, TScoreObject, TSheetObject } from "@Library/Common/DataObjects";
import { MusicXmlRW } from "../MusicXmlRW";

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
            status: JSON.stringify(rackObject.status).replaceAll("'","''"),
            title: rackObject.title.replaceAll("'","''"),
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
        let scoreObject: TScoreObject = {
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
        if (!scoreObject.measures){
            const musicXmlObject: TMusicXmlObject = this.getMusicXml(scoreObject.scoreId);
            const mmxl: MusicXmlRW = new MusicXmlRW(musicXmlObject.musicXml);
            scoreObject.mainKey = mmxl.MainKey;
            scoreObject.parts = mmxl.Instruments;
            scoreObject.measures = mmxl.MeasureCount;
            scoreObject.mainTempo = mmxl.Tempo;
//            const obj: TScoreObject = Object.assign({},scoreObject);
            scoreObject = this.setScore(scoreObject);
        }
        return scoreObject;
    }

    getDbScoreObject(scoreObject: TScoreObject): TDBScoreObject {
        return {
            scoreId: Number(scoreObject.scoreId),
            parentRackId: Number(scoreObject.parentRackId) || 0,
            sequence: Number(scoreObject.sequence) || 0,
            status: scoreObject.status?JSON.stringify(scoreObject.status).replaceAll("'","''"):"[]",
            title: scoreObject.title?scoreObject.title.replaceAll("'","''"):"",
            subtitle: scoreObject.subtitle?scoreObject.subtitle.replaceAll("'","''"):"",
            author: scoreObject.author?scoreObject.author.replaceAll("'","''"):"",
            measures: Number(scoreObject.measures),
            parts: scoreObject.parts?JSON.stringify(scoreObject.parts).replaceAll("'","''"):"[]",
            mainKey: Number(scoreObject.mainKey),
            mainTempo: scoreObject.mainTempo?JSON.stringify(scoreObject.mainTempo).replaceAll("'","''"):"{}",
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
        let sheetObject: TSheetObject = {
            sheetId: Number(dbSheetObject.sheetId),
            parentScoreId: Number(dbSheetObject.parentScoreId) || 0,
            sequence: Number(dbSheetObject.sequence) || 0,
            status: JSON.parse(dbSheetObject.status),
            title: dbSheetObject.title,
            subtitle: dbSheetObject.subtitle,
            practiceKeys: JSON.parse(dbSheetObject.practiceKeys),
            activeKey: Number(dbSheetObject.activeKey) || 0,
            measureStart: Number(dbSheetObject.measureStart),
            measureEnd: Number(dbSheetObject.measureEnd),
            hiddenParts: <THiddenPart>JSON.parse(dbSheetObject.hiddenParts) || null,
            transposeSettings: JSON.parse(dbSheetObject.transposeSettings) || null,
            shot: JSON.parse(dbSheetObject.shot),
            done: JSON.parse(dbSheetObject.done),
            loop: JSON.parse(dbSheetObject.loop),
        };
        if (sheetObject.transposeSettings === null) {
            const scoreObject: TScoreObject = this.getScore(sheetObject.parentScoreId);
            if (scoreObject) {
                sheetObject.practiceKeys = [scoreObject.mainKey];
                sheetObject.activeKey = scoreObject.mainKey;
                sheetObject.measureStart = 1;
                sheetObject.measureEnd = scoreObject.measures;
                sheetObject.hiddenParts = [];
                sheetObject.transposeSettings = {
                    type:"transposeByKey",
                    octave:0,
                    transposeKeySignatures:true,
                    removeKeySignatures:false,
                };
                sheetObject.shot = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                sheetObject.done = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                sheetObject.loop = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                sheetObject = this.setSheet(sheetObject);
            }
        }
        return sheetObject;
    }

    getDbSheetObject(sheetObject: TSheetObject): TDBSheetObject {
        return {
            sheetId: Number(sheetObject.sheetId),
            parentScoreId: Number(sheetObject.parentScoreId) || 0,
            sequence: Number(sheetObject.sequence) || 0,
            status: sheetObject.status?JSON.stringify(sheetObject.status).replaceAll("'","''"):"[]",
            title: sheetObject.title?sheetObject.title.replaceAll("'","''"):"",
            subtitle: sheetObject.subtitle?sheetObject.subtitle.replaceAll("'","''"):"",
            practiceKeys: sheetObject.practiceKeys?JSON.stringify(sheetObject.practiceKeys).replaceAll("'","''"):"[]",
            activeKey: Number(sheetObject.activeKey) || 0,
            measureStart: Number(sheetObject.measureStart),
            measureEnd: Number(sheetObject.measureEnd),
            hiddenParts: sheetObject.hiddenParts?JSON.stringify(sheetObject.hiddenParts).replaceAll("'","''"):"{}",
            transposeSettings: sheetObject.transposeSettings
                ?   JSON.stringify(sheetObject.transposeSettings).replaceAll("'","''")
                :   "{\"type\":\"transposeByKey\",\"octave\":0,\"transposeKeySignatures\":true,\"removeKeySignatures\":false}",
            shot: sheetObject.shot?JSON.stringify(sheetObject.shot).replaceAll("'","''"):"[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]",
            done: sheetObject.done?JSON.stringify(sheetObject.done).replaceAll("'","''"):"[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]",
            loop: sheetObject.loop?JSON.stringify(sheetObject.loop).replaceAll("'","''"):"[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]",
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
                "hiddenParts",
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
                '${sheet.hiddenParts}',
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
        dbSheets.forEach((dbSheet: TDBSheetObject) => {
            sheetObjects.push(this.getSheetObject(dbSheet));
        });
        return sheetObjects;
    }

    getDBMusicXmlObject(musicXmlObject: TMusicXmlObject): TDBZippedObject {
        return {
            parentScoreId: Number(musicXmlObject.parentScoreId) || 0,
            zipped: MusicXmlRW.zip(musicXmlObject.musicXml) || null,
        };
    }

    getMusicXmlObject(dbZippedObject: TDBZippedObject): TMusicXmlObject {
        return {
            parentScoreId: Number(dbZippedObject.parentScoreId) || 0,
            musicXml: MusicXmlRW.unzip(dbZippedObject.zipped) || null,
        };
    }

    getMusicXml(parentScoreId: number): TMusicXmlObject {
        const dbMusicXml: TDBZippedObject = <TDBZippedObject>this.prepare(`SELECT * FROM "zippeds" where "parentScoreId"=${parentScoreId};`).get();
        return this.getMusicXmlObject(dbMusicXml);
    }

    setMusicXml(musicXmlObject: TMusicXmlObject): TMusicXmlObject {
        const dbMusicXml: TDBZippedObject = this.getDBMusicXmlObject(musicXmlObject);
        this.exec(`
            REPLACE INTO "zippeds" (
                "parentScoreId",
                "zipped"
            ) VALUES (
                '${dbMusicXml.parentScoreId}',
                x'${dbMusicXml.zipped.toString("hex")}'
            );
        `);
        return this.getMusicXml(musicXmlObject.parentScoreId);
    }

    getMusicXmls(): TMusicXmlObject[] {
        const musicXmlObjects: TMusicXmlObject[] = [];
        const dbMusicXmlObjects: TDBZippedObject[] = <TDBZippedObject[]>this.prepare("SELECT * FROM \"zipped\";").all();
        dbMusicXmlObjects.forEach((dbMusicXmlObject: TDBZippedObject)=>{
            musicXmlObjects.push(this.getMusicXmlObject(dbMusicXmlObject));
        });
        return musicXmlObjects;
    }

}

import { default as FS } from "fs";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { TRackObject } from "@DataObjects/TRackObject";
import { STR } from "@Global/STR";
import { Package } from "@Backend/Package";
import { Letture } from "@Backend/Letture";
import { IDiaryObject } from "@Library/Common/Interfaces/IDiaryObject";
import { TScoreObject } from "@DataObjects/TScoreObject";
import { TSheetObject } from "@DataObjects/TSheetObject";
import { MusicXmlRW, PianissimoID } from "@Library/Backend/MusicXmlRW/MusicXmlRW";
import { TDBZippedObject, TMusicXmlObject } from "@Library/Common/DataObjects/TZippedObject";
import { Config } from "../Config";
import { TResponseUpdateField } from "@Library/Common/DataObjects/TResponseUpdateField";
import { TResponse } from "@Library/Common/DataObjects/TResponse";

export function BackendListeners(browserWindow: BrowserWindow, database: Letture): void {

    ipcMain.handle(STR.requestPackageInfo, async (event: Electron.IpcMainEvent) => {
        console.log(event);
        return Package;
    });


    ipcMain.handle("request-library-index", async (
        event: Electron.IpcMainEvent
    ) => {

        return {
            libraryName: Config.LibraryName,
            agenda: database.prepare("SELECT * FROM \"agenda\";").all(),
            defaults: database.prepare("SELECT * FROM \"defaults\";").all(),
            racks: database.getRacks(),
            scores: database.getScores(),
            sheets: database.getSheets(),
            zippeds: database.prepare("SELECT * FROM \"zippeds\";").all(),
        };
    });

    ipcMain.on(STR.requestSheetForSection, async (event: Electron.IpcMainEvent, ids: {sectionId: number, sheetId:  number}) => {
        console.log(event);
        const xmlBuffer: Buffer = (<Buffer>database.prepare(
            `SELECT DOWNLOADFILE("${STR.data}") FROM "${STR.library}" WHERE "${STR.type}"='${STR.sheet}' AND "${STR.id}"=${ids.sheetId};`
        ).pluck().get());
        if (xmlBuffer) {
            console.log(xmlBuffer.toString());
            event.reply(STR.responseSheetForSection, {sheetId: ids.sheetId, sectionId: ids.sectionId, xml: xmlBuffer.toString()});
        } else {
            event.reply(STR.responseSheetForSection, {sheetId: ids.sheetId, sectionId: ids.sectionId, xml: null});
        }
    });

    ipcMain.handle("request-update-field", async (
        event: Electron.IpcMainEvent, query: {table: string, pkey: string, id: number, field: string, value: any }
    ) => {
        console.log(typeof query.value, query);
        if (
            query.value === null ||
            query.value === undefined
        ) {
            query.value = "";
        } else if (
            Array.isArray(query.value) ||
            typeof query.value === "object"
        ) {
            query.value = JSON.stringify(query.value).replaceAll("'","''");
        } else {
            query.value = String(query.value).replaceAll("'","''");
        }

        database.exec(`UPDATE "${query.table}" SET
            "${query.field}"='${String(query.value)}'
            WHERE
            "${query.pkey}"=${query.id};
        `);
        const result: TResponseUpdateField = {
            asId: query.id,
            field: query.field,
            type: null,
            record: null,
        };
        if(query.table==="sheets") {
            result.type = "TSheetObject";
            result.record = database.getSheet(query.id);
        } else if (query.table==="scores") {
            result.type = "TScoreObject";
            result.record = database.getScore(query.id);
        } else if (query.table==="racks") {
            result.type = "TRackObject";
            result.record = database.getRack(query.id);
        }
        console.log(query.table);
        if (result.record!==null) {
            return result;
        } else {
            return null;
        }
    });

    ipcMain.handle("request-insert-rack", async (
        event: Electron.IpcMainEvent, rack: TRackObject
    ) => {
        console.log(rack);
        database.exec(`INSERT INTO "racks"
            (
                "rackId",
                "parentRackId",
                "sequence",
                "status",
                "title"
            ) VALUES (
                '${rack.rackId}',
                '${rack.parentRackId}',
                '${rack.sequence}',
                '${rack.status}',
                '${rack.title}'
            );
        `);

        const result: any = database.prepare(`
        SELECT * FROM
        "racks"
        WHERE
        "rackId"=${rack.rackId};
        `).get();
        console.log("RESULT",result);
        return result;
    });

    ipcMain.handle("request-add-sheet", async (
        event: Electron.IpcMainEvent,
        sheet: TSheetObject
    ): Promise<TResponse> => {
        const responseSheet: TSheetObject = database.setSheet(sheet);
        if (responseSheet) {
            return {
                error: 0,
                message: "Sheet created!",
                type: "TSheetObject",
                data: responseSheet,
            };
        } else {
            return {
                error: 1,
                message: "Sheet NOT created!",
                type: null,
                data: null,
            };
        }
    });


    ipcMain.handle("request-musicxml", async (
        event: Electron.IpcMainEvent, parentScoreId: number
    ): Promise<TResponse> => {
        const response: TResponse = {
            error : 1,
            message : "MusicXml error on DB",
            type : null,
            data : null,
        };
        const musicXmlObject: TMusicXmlObject = database.getMusicXml(parentScoreId);
        if (
            musicXmlObject &&
            "parentScoreId" in musicXmlObject &&
            musicXmlObject.parentScoreId === parentScoreId &&
            "musicXml" in musicXmlObject &&
            musicXmlObject.musicXml
        ) {
            response.error = 0;
            response.message = "";
            response.type = "TMusicXmlObject";
            response.data = musicXmlObject;
        }
        return response;
    });

    ipcMain.handle("request-add-score", async (
        event: Electron.IpcMainEvent,
        score: TScoreObject
    ): Promise<TResponse> => {
        return dialog.showOpenDialog(
            BrowserWindow.getFocusedWindow(),
            {
                properties: ["openFile"],
                filters: [
                    { name: "musicxml", extensions: ["musicxml"] },
                ],
            }
        ).then((opened): TResponse => {
            const response: TResponse = {
                error : 1,
                message : "Score NOT created",
                type : null,
                data : null,
            };
            if (!opened.canceled) {
                const data: any = createNewScoreFromFile(database, score, opened.filePaths[0]);
                if (data) {
                    response.error = 0;
                    response.message = "Score created!";
                    response.type = "TLibraryObject";
                    response.data = data;
                }
            } else {
              console.log("no file selected");
            }
            return response;
        });
    });

    ipcMain.handle("request-consens-for-library-object-deletion", async (
        event: Electron.IpcMainEvent
    ) => {
        return dialog.showMessageBoxSync(
            browserWindow,
            {
                message: "Warning! This action will permanently remove the selected item and all child elements belonging to the same object.",
                type: "warning",
                buttons: ["Cancel","OK"],
                defaultId: 1,
                title: "Warning!",
            }
        ) === 1;
    });

    ipcMain.handle("request-set-config-key-value", async (
        event: Electron.IpcMainEvent, conf: {key: string, value: string}
    ) => {
        console.log(conf);
        Config.setKeyValue(conf.key, conf.value);
        return Config.getKeyValue(conf.key)===conf.value;
    });

    ipcMain.handle("request-get-config-key-value", async (
        event: Electron.IpcMainEvent, key: string
    ) => {
        return Config.getKeyValue(key);
    });

    ipcMain.handle("request-delete-library-objects", async (
        event: Electron.IpcMainEvent, ids: { rackIds: number[], scoreIds: number[], sheetIds: number[]}
    ) => {
        const sql: string[] = [];
        if (ids && "sheetIds" in ids && Array.isArray(ids.sheetIds) && ids.sheetIds.length) {
            sql.push(`DELETE FROM  "sheets" WHERE "sheetId" IN (${ids.sheetIds.join(",")})`);
        }
        if (ids && "scoreIds" in ids && Array.isArray(ids.scoreIds) && ids.scoreIds.length) {
            sql.push(`DELETE FROM  "zippeds" WHERE "parentScoreId" IN (${ids.scoreIds.join(",")})`);
            sql.push(`DELETE FROM  "scores" WHERE "scoreId" IN (${ids.scoreIds.join(",")})`);
        }
        if (ids && "rackIds" in ids && Array.isArray(ids.rackIds) && ids.rackIds.length) {
            sql.push(`DELETE FROM  "racks" WHERE "rackId" IN (${ids.rackIds.join(",")})`);
        }
        database.exec(sql.join(";")+";");
        return true;
    });

    ipcMain.handle("request-rack-sequence-changed", async (
        event: Electron.IpcMainEvent, obj: {rackId: number, sequence: number}
    ) => {
        database.exec(`UPDATE "racks" SET
            "sequence"=${obj.sequence}
            WHERE
            "rackId"=${obj.rackId};
        `);

        const result: any = database.prepare(`SELECT "sequence" FROM "racks" WHERE "rackId"=${obj.rackId}`).pluck().get();
        return {old: obj.sequence, new: result};
        //return (("sequence" in result) && (result.sequence === obj.sequence));
    });

}

function createNewScoreFromFile(
    database: Letture,
    score: TScoreObject,
    filename: string
): { score: TScoreObject, sheet: TSheetObject, zipped: TDBZippedObject } {
    if (FS.existsSync(filename)){
        const mmxl: MusicXmlRW = new MusicXmlRW();
        mmxl.loadXml(filename);
        const ppId: PianissimoID = mmxl.Pianissimo;
        if (ppId!==null && ppId.id>0) {
            score.scoreId = ppId.id;
        }
        mmxl.Pianissimo = {app:"pianissimo", user:"pianissimo", id: score.scoreId};
        score.title = mmxl.Title;
        score.subtitle = mmxl.Subtitle;
        score.mainKey = mmxl.MainKey;
        score.parts = mmxl.Instruments;
        score.measures = mmxl.MeasureCount;
        score.mainTempo = mmxl.Tempo;

        database.exec(`
            REPLACE INTO "zippeds" (
                "parentScoreId",
                "zipped"
            ) VALUES (
                '${score.scoreId}',
                x'${mmxl.Zipped.toString("hex")}'
            );
        `);

        const resultZipped: TDBZippedObject = <TDBZippedObject>database.prepare(`
        SELECT * FROM
        "zippeds"
        WHERE
        "parentScoreId"=${score.scoreId};
        `).get();

        if (resultZipped){

            const resultScore: TScoreObject =  database.setScore(score);
            if (resultScore) {
                const sheetId: number = Number(String(resultScore.scoreId).replace("3","4"));
                const sheetObject: TSheetObject = {
                    sheetId: sheetId,
                    parentScoreId: resultScore.scoreId,
                    sequence: 0,
                    status: [],
                    title: "Play it all",
                    subtitle: "",
                    practiceKeys: [resultScore.mainKey],
                    activeKey: resultScore.mainKey,
                    measureStart: 1,
                    measureEnd: resultScore.measures,
                    hiddenParts: [],
                    transposeSettings: {type:"transposeByKey",octave:0,transposeKeySignatures:true,removeKeySignatures:false},
                    shot: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    done: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    loop: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                };

                const resultSheet: TSheetObject = database.setSheet(sheetObject);
                if (resultSheet) {
                    return {
                        score: resultScore,
                        sheet: resultSheet,
                        zipped: resultZipped
                    };
                }
            }
        }
    }
    return null;
}

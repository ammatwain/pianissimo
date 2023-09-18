import { ipcMain } from "electron";
import { TRackObject } from "@DataObjects/TRackObject";
import { STR } from "@Global/STR";
import { Package } from "@Backend/Package";
import { FSWalk } from "@Backend/FSWalk";
import { Letture } from "@Backend/Letture";
import { Walk } from "@Common/Walk";
import { IBranchCustom } from "@Library/Common/Interfaces/IBranchCustom";
import { IBranchObject } from "@Library/Common/Interfaces/IBranchObject";
import { IDiaryObject } from "@Library/Common/Interfaces/IDiaryObject";

export function BackendListeners(database: Letture): void {
    ipcMain.on("_request-dir-listing", async (event: Electron.IpcMainEvent,dir: string) => {
        console.log(event);
        const walk: FSWalk = new FSWalk(dir);
        event.reply("response-dir-listing", walk.TreeObjects);
    });

    ipcMain.handle(STR.requestDirListing, async (event: Electron.IpcMainEvent, dir: string) => {
        console.log(event);
        const fswalk: FSWalk = new FSWalk(dir);
        const walk: Walk = new Walk(fswalk.LinearObjects);
        return { linear: walk.LinearObjects,  tree: walk.TreeObjects };
    });

    ipcMain.handle(STR.requestPackageInfo, async (event: Electron.IpcMainEvent) => {
        console.log(event);
        return Package;
    });

    ipcMain.handle( STR.requestSaveBranchCustom, async (event: Electron.IpcMainEvent, id: number, branchObjectCustom: IBranchCustom) => {
        database.exec(`UPDATE "${STR.library}" SET
            "${STR.custom}" = '${JSON.stringify(branchObjectCustom)}'
        WHERE
            "${STR.id}" = ${id}
        ;`);
        const resultBranchObjectCustom: IBranchCustom = <IBranchCustom>JSON.parse(<string>database.prepare(`SELECT
            "${STR.custom}"
        FROM
            "${STR.library}"
        WHERE
           "${STR.id}" = ${id};`
        ).pluck().get());

        return branchObjectCustom;
    });

    ipcMain.handle(STR.requestSaveBranch, async (event: Electron.IpcMainEvent, branchObject: IBranchObject) => {
        database.exec(`UPDATE "${STR.library}" SET
            "${STR.parentid}" = ${branchObject.parentid},
            "${STR.sequence}" = ${branchObject.sequence},
            "${STR.type}" = '${branchObject.type}',
            "${STR.name}" = '${branchObject.name}',
            "${STR.custom}" = '${JSON.stringify(branchObject.custom)}'
        WHERE
            "${STR.id}" = ${branchObject.id}
        ;`);
        const resultBranchObject: IBranchObject = <IBranchObject>database.prepare(`SELECT
            "${STR.id}",
            "${STR.parentid}",
            "${STR.sequence}",
            "${STR.type}",
            "${STR.name}",
            "${STR.custom}"
        FROM
            "${STR.library}"
        WHERE
           "${STR.id}" = ${branchObject.id};`).pluck().get();

        return resultBranchObject;
    });

    ipcMain.handle("request-library-index", async (
        event: Electron.IpcMainEvent
    ) => {

        return {
            agenda: database.prepare("SELECT * FROM \"agenda\";").all(),
            defaults: database.prepare("SELECT * FROM \"defaults\";").all(),
            racks: database.prepare("SELECT * FROM \"racks\" ORDER BY \"parentRackId\" ASC,\"sequence\" ASC;").all(),
            scores: database.prepare("SELECT * FROM \"scores\" ORDER BY \"parentRackId\" ASC,\"sequence\" ASC;").all(),
            sheets: database.prepare("SELECT * FROM \"sheets\" ORDER BY \"parentScoreId\" ASC,\"sequence\" ASC;").all(),
            zippedScoreFiles: database.prepare("SELECT * FROM \"zippedScoreFiles\";").all(),
        };
    });

    ipcMain.handle(STR.requestSaveDiaryAndSection, async (
        event: Electron.IpcMainEvent, objs: {diaryObject: IDiaryObject, sectionObject: IBranchObject}
    ) => {
        database.exec(`INSERT INTO "${STR.diary}" (
            "${STR.datetime}",
            "${STR.duration}",
            "${STR.id}",
            "${STR.key}",
            "${STR.bpm}",
            "${STR.score}"
        ) VALUES (
            ${objs.diaryObject.datetime},
            ${objs.diaryObject.duration},
            ${objs.diaryObject.id},
            ${objs.diaryObject.key},
            ${objs.diaryObject.bpm},
            ${objs.diaryObject.score}
        );`);

        const sql: string = `UPDATE "${STR.library}"
        SET
            "${STR.custom}" = '${JSON.stringify(objs.sectionObject.custom)}'
        WHERE
            "${STR.id}" = ${objs.sectionObject.id}
        ;`;
        console.log(sql);
        database.exec(sql);

        return true;
    });

    ipcMain.on(STR.requestSheetList, async (event: Electron.IpcMainEvent) => {
        const branchObjects: IBranchObject[] = database.getLinearLibrary();
        event.reply(STR.responseSheetList, branchObjects);
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
        event: Electron.IpcMainEvent, query: {table: string, pkey: string, id: number, field: string, value: number | string }
    ) => {
        database.exec(`UPDATE "${query.table}" SET
            "${query.field}"='${String(query.value)}'
            WHERE
            "${query.pkey}"=${query.id};
        `);

        const result: any = database.prepare(`
        SELECT "${query.field}" FROM
        "${query.table}"
        WHERE
        "${query.pkey}"=${query.id};
        `).pluck().get();
        return String(query.value) === String(result);
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

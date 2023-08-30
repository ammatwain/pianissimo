import { ipcMain } from "electron";
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

    ipcMain.handle(STR.requestSaveDiary, async (event: Electron.IpcMainEvent, diaryObject: IDiaryObject) => {
        database.exec(`INSERT INTO "${STR.diary}" (
            "${STR.datetime}",
            "${STR.duration}",
            "${STR.id}",
            "${STR.score}"
        ) VALUES (
            ${diaryObject.datetime},
            ${diaryObject.duration},
            ${diaryObject.id},
            ${diaryObject.score}
        );`);
        return true;
    });

    ipcMain.on(STR.requestSheetList, async (event: Electron.IpcMainEvent) => {
        const branchObjects: IBranchObject[] = database.getLinearLibrary();
        event.reply(STR.responseSheetList, branchObjects);
    });

    ipcMain.on(STR.requestSheet, async (event: Electron.IpcMainEvent, sheetId: number) => {
        console.log(event);
        const xmlBuffer: Buffer = (<Buffer>database.prepare(
            `SELECT DOWNLOADFILE("${STR.data}") FROM "${STR.library}" WHERE "${STR.type}"='${STR.sheet}' AND "${STR.id}"=${sheetId};`
        ).pluck().get());
        if (xmlBuffer) {
            event.reply(STR.responseSheet, {id: sheetId, xml: xmlBuffer.toString()});
        } else {
            event.reply(STR.responseSheet, {id: sheetId, xml: null});
        }
    });
}

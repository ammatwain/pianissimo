import FS from "fs";
import PATH from "path";
import { app, BrowserWindow, ipcMain, protocol, net } from "electron";
import { Config } from "@Backend/Config";
import { Package } from "@Backend/Package";
import { Letture } from "@Backend/Letture";
import { BackendListeners } from "@Backend/BackendListeners";
import { FSWalk } from "@Library/Backend/FSWalk/FSWalk";
import { MusicXmlRW, PianissimoID } from "@Library/Backend/MusicXmlRW/MusicXmlRW";
import { IBranchObject } from "@Library/Common/Interfaces/IBranchObject";
import { STR } from "@Library/Global/STR";


// This allows TypeScript to pick up the magic constants that's auto-generated App Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

function createBookId(): number {
    return Number(`2${Date.now()}`);
}

function createSheetId(): number {
    return Number(`3${Date.now()}`);
}

function createSectionId(): number {
    return Number(`4${Date.now()}`);
}

if(!(app.isPackaged && FS.existsSync(Config.Database))) {
    console.log("First copy of database");
/*
    const preLetture: Letture = new Letture(PATH.resolve(__dirname,"Data/Letture.db"),null);
    console.log("TEST", preLetture.prepare("SELECT * from \"homedir\";").all());

    const fswalk: FSWalk = new FSWalk(PATH.resolve(__dirname,"Data/Letture"));
    console.log(fswalk.LinearAsJSONString);
    fswalk.LinearObjects.forEach((branch: IBranchObject)=>{
        let data: string = "NULL";
        let ppId: PianissimoID;
        branch.custom = {};

        if(branch.type === STR.sheet) {
            const mmxl: MusicXmlRW = new MusicXmlRW();
            console.log(branch.$path);
            mmxl.loadXml(branch.$path);
            ppId = mmxl.Pianissimo;
            if (ppId!==null && ppId.id>0) {
                branch.id = ppId.id;
            }
            mmxl.Pianissimo = {app:"pianissimo", user:"pianissimo", id: branch.id};
            branch.custom.parts = mmxl.PartCount;
            branch.custom.instruments = mmxl.Instruments;
            branch.custom.mainKey = mmxl.MainKey;
            branch.custom.measures = mmxl.MeasureCount;
            branch.custom.tempo = mmxl.Tempo;
            mmxl.saveXml(branch.$path);
            data = `UPLOADFILE('${branch.$path}')`;
        }
        const sql: string = `INSERT INTO "library" (
          "id",
          "parentid",
          "sequence",
          "type",
          "name",
          "custom",
          "data"
        ) VALUES (
          ${branch.id},
          ${branch.parentid},
          ${branch.sequence},
          '${branch.type}',
          '${branch.name}',
          '${JSON.stringify(branch.custom)}',
          ${data}
        );`;
        try {
            preLetture.exec(sql);
        } catch {
            console.log(sql);
        }
    });
    const sheets: {id: number}[] = <{id: number}[]>preLetture.prepare(
        `SELECT id FROM "library" WHERE "type"='${STR.sheet}';`
    ).all();
    sheets.forEach((n: {id: number})=>{
        preLetture.exec(
            `INSERT INTO "library" ("parentid","type","sequence","name") VALUES
            (${n.id},'${STR.section}','-1.0','Play it from beginning to end, including repetitions');`
        );
    });
    preLetture.Db.close();
*/

    // COPY DEFAULT DB
    FS.copyFileSync(
        PATH.resolve(__dirname,"Data/pianissimo.db"),
        Config.Database
    );
}

const letture: Letture =  new Letture(Config.Database);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow: () => void = (): void => {
    // Create the browser window.
    const mainWindow: BrowserWindow = new BrowserWindow({
        alwaysOnTop: false,
        width: 1800,
        height: 1000,
        title: `${Package.name.charAt(0).toUpperCase() + Package.name.slice(1)} - v${Package.version}`,
        //fullscreen: true,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });
    BackendListeners(mainWindow, letture);
    mainWindow.setIcon(PATH.resolve(__dirname,"pianissimo.png"));
    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(() => {
    protocol.handle("atom", (request: Request) =>
      net.fetch("file://" + request.url.slice("atom://".length)));
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

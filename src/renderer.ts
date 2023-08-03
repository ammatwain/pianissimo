/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { IArborBranch, Arbor } from './LibraryRenderer';

import './index.scss';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        electron: any;
    }
}

console.log('👋 This message is being logged by "renderer.js", included via webpack');

window.electron.ipcRenderer.on('response-dir-listing', (arg: any) => {
    console.log(arg);
});

let osmd: OpenSheetMusicDisplay;
let selectSample: string;
let error_tr: HTMLTableRowElement;
let error_td: HTMLTableCellElement;

const arborData: IArborBranch[] = [
    {
        id: '0',
        text: 'branch-0',
        children: [
            {
                id: '0-0',
                text: 'branch-0-0',
                children: [
                    {id: '0-0-0', text: 'branch-0-0-0', percent: 0},
                    {id: '0-0-1', text: 'branch-0-0-1', percent: 0},
                    {id: '0-0-2', text: 'branch-0-0-2', percent: 0},
                ],
            },
            {id: '0-1', text: 'branch-0-1', percent: 0},
        ],
    },
    {
        id: '1',
        text: 'branch-1',
        children: [
            {id: '1-0', text: 'branch-1-0', percent: 0},
            {id: '1-1', text: 'branch-1-1', percent: 0}
        ],
    },
];

function error(errString = "") {
    if (!errString) {
        error_tr.style.display = "none";
    } else {
        console.log("[OSMD demo] error: " + errString);
        error_td.textContent = errString;
        error_tr.style.display = "";
        //canvas.style.width = canvas.style.height = String(0);
        enable();
    }
}

function enable() {
    document.body.style.opacity = String(1);
    //setDisabledForControls("");
    //logCanvasSize();
}

function disable() {
    document.body.style.opacity = String(0.1);
    //setDisabledForControls("disabled");
}

function selectSampleOnChange(str = "./Letture/Amedeo_Sorpreso/Esercizi_5_Note/Esercizio_Indipendenza_1.jmxl/sheet.mxl") {
    error();
    disable();
    if (selectSample) {
        str = selectSample.value;
    }
    // zoom = 1.0;

    osmd.load(str).then(
        function () {
            osmd.zoom = 0.666;
            return osmd.render();
        },
        function (e) {
            console.log("ERROR",str);
            //errorLoadingOrRenderingSheet(e, "rendering");
        }
    ).then(
        function () {
            if (1) {
                // "0" is bad for now, then 0 --> 12
                //transposeByKey.value = String(osmd.TransposeCalculator.Options.MainKey  || 0 );
                enable();
            }
            return;
        }, function (e) {
            //errorLoadingOrRenderingSheet(e, "loading");
            //onLoadingEnd(isCustom);
            enable();
        }
    );
}

document.addEventListener("DOMContentLoaded",()=>{
    osmd = new OpenSheetMusicDisplay("osmd");
    error_td = document.querySelector("#error-td");
    error_tr = document.querySelector("#error-tr");
    const arbor = new Arbor("#arbor", {data: arborData});
    arbor.updateAllPercents();
    console.log(osmd.Version);
    window.electron.ipcRenderer.sendMessage('request-dir-listing', {});
    window.setInterval(()=>{
        const node = arbor.randomBranch;
        arbor.setPercent(node, (node.percent || 0) + 0.1);
    },100);
    selectSampleOnChange();
});
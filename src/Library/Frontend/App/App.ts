import { STR } from "@Global/STR";
import { WTree } from "@Frontend/WTree";
import { WebMidi, Input } from "@Frontend/WebMidi";
import { Maestro } from "@Frontend/Maestro";
import { WTabContainer } from "@Frontend/WTabs";
import { BranchClass } from "@Frontend/BranchClass";
import { IBranchObject } from "@Interfaces/IBranchObject";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
//
import "./App.scss";
import { FrontendListeners } from "../FrontendListeners";

/*
import { electronHandler } from "../";
*/

declare global {
    interface Window {
        electron: any;
    }
}

interface IAppData {
    test?: HTMLElement;
    tabs?: WTabContainer;
    treeDivID?: string;
    tree?: WTree;
    errorTdId?: string;
    errorTd?: HTMLTableCellElement;
    errorTrId?: string;
    errorTr?: HTMLTableRowElement;
    osmdDivId?: string;
    osmd?: OpenSheetMusicDisplay;
    midiInput?: Input[];
    maestro?: Maestro;
    selectSample?: string;
}

export class App {
    private data: IAppData = {};
    constructor (
        osmdDivId: string = "osmd",
        treeDivID: string = "tree",
        errorTdId: string = "error-td",
        errorTrId: string = "error-tr"
    ) {
        this.data.errorTdId = errorTdId;
        this.data.errorTrId = errorTrId;
        this.data.treeDivID = treeDivID;
        this.data.osmdDivId = osmdDivId;
        document.addEventListener("DOMContentLoaded",() => {
            this.domContentLoaded();
        });
    }

    domContentLoaded(): void {
        this.data.test = document.querySelector("#test");
        this.data.errorTd = document.querySelector(`#${this.data.errorTdId}`);
        this.data.errorTr = document.querySelector(`#${this.data.errorTrId}`);
        this.data.tabs = new WTabContainer(document.querySelector("w-tab-container"));

        console.log(this.data.errorTdId, this.data.errorTdId);
        // webmidi
        WebMidi.enable().then(() => {
            console.log("WebMidi.js has been enabled!");
            // osmd
            this.data.osmd = new OpenSheetMusicDisplay(this.data.osmdDivId, {
                backend: "svg",
                drawTitle: true,
                drawSubtitle: true,
                disableCursor:false,
                followCursor:true,
            });
            console.log("OSMD has been enabled!", this.data.osmd.Version);
            this.data.midiInput = WebMidi.inputs;
            //maestro
            this.data.maestro = new Maestro({osmd: this.osmd, midiInputs: this.midiInputs});
            console.log("Maestro has been enabled!");

            this.data.tree = <WTree>document.querySelector("#tree");
            this.data.tree.onChange = (): void => {
                const values: number[] = this.data.tree.getValues();
                if (values.length===1) {
                    const sheet: BranchClass = this.data.tree.getLeafById( values[0]).closest(STR.sheet);
                    if(sheet) {
                        window.electron.ipcRenderer.sendMessage(STR.requestSheet, sheet.id);
                    }
                }
            };
            this.setListeners();
        });
    }

    setListeners(): void {
        FrontendListeners(this);
    }

    public get Data(): IAppData {
        return this.data;
    }

    public get osmd(): OpenSheetMusicDisplay {
        return this.data.osmd || null;
    }

    public get midiInputs(): Input[] {
        return this.data.midiInput || null;
    }

    public get tree(): WTree {
        return this.data.tree || null;
    }

    public get maestro(): Maestro {
        return this.data.maestro || null;
    }

    disable(): void {
        document.body.style.opacity = String(0.1);
        //setDisabledForControls("disabled");
    }

    enable(): void {
        document.body.style.opacity = String(1);
        //setDisabledForControls("");
        //logCanvasSize();
    }

    error(errString: string = ""): void {
        if (!errString) {
            this.data.errorTr.style.display = STR.none;
        } else {
            console.log("[OSMD demo] error: " + errString);
            this.data.errorTd.textContent = errString;
            this.data.errorTr.style.display = "";
            //canvas.style.width = canvas.style.height = String(0);
            this.enable();
        }
    }

    selectSampleOnChange(sample = "", title = ""): void {
        this.error();
        this.disable();
        if (this.data.selectSample !== sample) {
            this.data.selectSample = sample;
            this.osmd.load(this.data.selectSample, title).then(
                () => {
                    this.osmd.zoom = 0.666;
                    return this.osmd.render();
                },
                () => {
                    console.log("ERROR",sample);
                    //errorLoadingOrRenderingSheet(e, "rendering");
                }
            ).then(
                () => {
                    if (1) {
                        // "0" is bad for now, then 0 --> 12
                        //transposeByKey.value = String(osmd.TransposeCalculator.Options.MainKey  || 0 );
                        this.enable();
                    }
                    return;
                },  () => {
                    //errorLoadingOrRenderingSheet(e, "loading");
                    //onLoadingEnd(isCustom);
                    this.enable();
                }
            );
        }
    }
}

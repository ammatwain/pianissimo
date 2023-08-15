import './App.scss';
import { Tree } from "../Tree";
import { WebMidi, Input } from "../WebMidi";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { Maestro } from '../Maestro';
import { WTabContainer } from '../WTabs';

declare global {
    interface Window {
        electron: any;
    }
}

interface IAppData {
    tabs?: WTabContainer;
    treeDivID?: string;
    tree?: Tree;
    errorTdId?: string;
    errorTd?: HTMLTableCellElement;
    errorTrId?: string;
    errorTr?: HTMLTableRowElement;
    osmdDivId?: string;
    osmd? : OpenSheetMusicDisplay;
    midiInput? : Input[];
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
                disableCursor:false,
                followCursor:true,
            });
            console.log("OSMD has been enabled!", this.data.osmd.Version);
            this.data.midiInput = WebMidi.inputs;
            //maestro
            this.data.maestro = new Maestro({osmd: this.osmd, midiInputs: this.midiInputs});
            console.log("Maestro has been enabled!");

            this.data.tree = new Tree(`#${this.data.treeDivID}`, {closeDepth:1, onChange: ()=>{
                const values: string[] = this.tree.getValues();
                if (values.length===1) {
                    window.electron.ipcRenderer.sendMessage('request-sheet', values[0]);
                    console.log(this.tree.getLeafById(values[0]));
                }
            }});
            this.setListeners();
        });
    }

    setListeners() {
        window.electron.ipcRenderer.on("response-dir-listing", (arg: any) => {
            //
        });

        window.electron.ipcRenderer.on("response-sheet-list", (arg: any) => {
            if (this.tree){
                this.tree.initialize(arg);
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.electron.ipcRenderer.on('response-sheet', (arg: any) => {
            this.maestro.loadXmSheet(arg);
            console.log(typeof arg);
        });

        window.electron.ipcRenderer.sendMessage('request-dir-listing', {});
        window.electron.ipcRenderer.sendMessage('request-sheet-list', {});

        this.maestro.setListeners();

        // this.test();
    }

    public get osmd(): OpenSheetMusicDisplay {
        return this.data.osmd || null;
    }

    public get midiInputs(): Input[] {
        return this.data.midiInput || null;
    }

    public get tree(): Tree {
        return this.data.tree || null;
    }

    public get maestro(): Maestro {
        return this.data.maestro || null;
    }

    disable() {
        document.body.style.opacity = String(0.1);
        //setDisabledForControls("disabled");
    }

    enable() {
        document.body.style.opacity = String(1);
        //setDisabledForControls("");
        //logCanvasSize();
    }

    error(errString: string = "") {
        if (!errString) {
            this.data.errorTr.style.display = "none";
        } else {
            console.log("[OSMD demo] error: " + errString);
            this.data.errorTd.textContent = errString;
            this.data.errorTr.style.display = "";
            //canvas.style.width = canvas.style.height = String(0);
            this.enable();
        }
    }

    selectSampleOnChange(sample = "", title = "") {
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

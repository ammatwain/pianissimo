import './App.scss';
import { IArborBranch } from '../../LibraryCommon';
import { Arbor } from "../Arbor";
import { WebMidi, Input, NoteMessageEvent } from "../WebMidi";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

declare global {
    interface Window {
        electron: any;
    }
}

interface IAppData {
    arborDivID?: string;
    arbor?: Arbor;
    errorTdId?: string;
    errorTd?: HTMLTableCellElement;
    errorTrId?: string;
    errorTr?: HTMLTableRowElement;
    osmdDivId?: string;
    osmd? : OpenSheetMusicDisplay;
    midiInput? : Input[] = [];
    selectSample?: string;
}

export class App {
    private data: IAppData = {};
    constructor (
        osmdDivId: string = "osmd",
        arborDivID: string = "arbor",
        errorTdId: string = "error-td",
        errorTrId: string = "error-tr"
    ) {
        this.data.errorTdId = errorTdId;
        this.data.errorTrId = errorTrId;
        this.data.arborDivID = arborDivID;
        this.data.osmdDivId = osmdDivId;
        document.addEventListener("DOMContentLoaded",() => {
            this.domContentLoaded();
        });
    }

    domContentLoaded(): void {
        this.data.errorTd = document.querySelector(`#${this.data.errorTdId}`);
        this.data.errorTr = document.querySelector(`#${this.data.errorTrId}`);
        console.log(this.data.errorTdId, this.data.errorTdId);
        // webmidi
        WebMidi.enable().then(() => {
            console.log("WebMidi.js has been enabled!");
            this.data.midiInput = WebMidi.inputs;
        });
        // osmd
        this.data.osmd = new OpenSheetMusicDisplay(this.data.osmdDivId, {
            backend: "svg",
            drawTitle: true,
            disableCursor:false,
            followCursor:true,
        });
        console.log(this.data.osmd.Version);
        //arbor
        this.data.arbor = new Arbor(`#${this.data.arborDivID}`, {closeDepth:1, onChange: ()=>{
            const values: string[] = this.arbor.getValues();
            if (values.length===1) {
                const leaf: IArborBranch = this.arbor.getLeafById(values[0]);
                if (leaf) {
                    this.selectSampleOnChange(`${leaf.path}/${leaf.sheet}`, leaf.caption);
                }
            }
        }});
        this.setListeners();
    }

    setListeners() {
        window.electron.ipcRenderer.on("response-dir-listing", (arg: any) => {
            if (this.arbor){
                this.arbor.initialize(arg);
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.electron.ipcRenderer.on('response-sheet', (arg: any) => {
            console.log(arg);
        });
        if (this.midiInputs) {
            this.midiInputs.forEach((input: Input)=>{

                input.addListener("noteon",(e: NoteMessageEvent)=>{
                    console.log(e.note.number);
    //              musicante.setMidiNoteOn(e.note.number);
    //                  if(musicante.allNotesUnderCursorArePlayed()){
    //                  musicante.next();
    //              }
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

                input.addListener("noteoff",(e: NoteMessageEvent)=>{
                    console.log(e.note.number);
    //              musicante.setMidiNoteOff(e.note.number);
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

                input.addListener("pitchbend",(e: NoteMessageEvent)=>{
                    console.log(e);
    //              musicante.setMidiNoteOff(e.note.number);
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

            });
        }
        window.electron.ipcRenderer.sendMessage('request-dir-listing', {});

        // this.test();
    }

    test(){
        window.setInterval(()=>{
            const node = this.arbor.randomBranch;
            this.arbor.setPercent(node, (node.percent || 0) + 50);
        },100);
    }

    public get osmd(): OpenSheetMusicDisplay {
        return this.data.osmd || null;
    }

    public get midiInputs(): Input[] {
        return this.data.midiInput || null;
    }

    public get arbor(): Arbor {
        return this.data.arbor || null;
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

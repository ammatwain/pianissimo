import { STR } from "@Global/STR";
import { WTree } from "@Frontend/WTree";
import { WebMidi, Input } from "@Frontend/WebMidi";
import { Maestro } from "@Frontend/Maestro";
import { WTabContainer } from "@Frontend/WTabs";
import { BranchClass } from "@Frontend/BranchClass";
import { IBranchObject } from "@Interfaces/IBranchObject";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { ExtendedTransposeCalculator } from "extended-transpose-calculator";

//
import "./App.scss";
import { FrontendListeners } from "@Frontend/FrontendListeners";
import { WBranches } from "@Frontend/WBranch";

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
    branches?: WBranches;
    errorTdId?: string;
    errorTd?: HTMLTableCellElement;
    errorTrId?: string;
    errorTr?: HTMLTableRowElement;
    osmdDivId?: string;
    branchesDivID?: string;
    osmd?: OpenSheetMusicDisplay;
    etc?: ExtendedTransposeCalculator;
    midiInput?: Input[];
    maestro?: Maestro;
    selectSample?: string;
}

export class App {
    private data: IAppData = {};
    constructor (
        osmdDivId: string = "osmd",
        treeDivID: string = "tree",
        branchesDivID: string = "branches",
        errorTdId: string = "error-td",
        errorTrId: string = "error-tr"
    ) {
        this.data.errorTdId = errorTdId;
        this.data.errorTrId = errorTrId;
        this.data.treeDivID = treeDivID;
        this.data.branchesDivID = branchesDivID;
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
            this.Osmd = new OpenSheetMusicDisplay(this.data.osmdDivId, {
                backend: "svg",
                drawTitle: true,
                drawSubtitle: true,
                disableCursor:false,
                followCursor:true,
            });

            this.Etc = new ExtendedTransposeCalculator(this.Osmd);
            this.Osmd.TransposeCalculator = this.Etc;

            console.log("OSMD has been enabled!", this.data.osmd.Version);
            this.data.midiInput = WebMidi.inputs;
            //maestro
            console.log("Maestro has been enabled!");

            this.data.tree = <WTree>document.querySelector(`#${this.data.treeDivID}`);
            this.data.branches = <WBranches>document.querySelector(`#${this.data.branchesDivID}`);
            this.data.maestro = new Maestro({etc: this.Etc, midiInputs: this.MidiInputs, tree: this.Tree, branches: this.data.branches});
            this.data.tree.onChange = (): void => {
                const values: number[] = this.data.tree.getValues();
                if (values.length===1) {
                    const section: BranchClass = this.data.tree.getLeafById( values[0]);// .closest(STR.sheet);
                    if (section && section.Type === STR.section) {
                        if(section) {
                            console.log("SECTION", section);
                            console.log("SHEET", this.data.tree.getBranchById( section.ParentId).Custom);
                            window.electron.ipcRenderer.sendMessage(
                                STR.requestSheetForSection, {
                                    sectionId: section.Id,
                                    sheetId: section.ParentId,
                                }
                            );
                        }
                    }
                }
            };
            this.setListeners();
        });
    }

    setListeners(): void {
        FrontendListeners(this);
    }

    public get Branches(): WBranches {
        return this.data.branches || null;
    }


    public get Data(): IAppData {
        return this.data;
    }

    public get Etc(): ExtendedTransposeCalculator {
        return this.data.etc;
    }

    public set Etc(etc: ExtendedTransposeCalculator) {
        if (etc instanceof ExtendedTransposeCalculator) {
            this.data.etc = etc;
        }
    }

    public get Osmd(): OpenSheetMusicDisplay {
        return this.data.osmd || null;
    }

    public set Osmd(osmd: OpenSheetMusicDisplay) {
        if (osmd instanceof OpenSheetMusicDisplay) {
            this.data.osmd = osmd;
        }
    }

    public get MidiInputs(): Input[] {
        return this.data.midiInput || null;
    }

    public get Tree(): WTree {
        return this.data.tree || null;
    }

    public get Maestro(): Maestro {
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
            this.Osmd.load(this.data.selectSample, title).then(
                () => {
                    this.Osmd.zoom = 0.666;
                    return this.Osmd.render();
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

import { ASCore } from "./ASCore";
import { OpenSheetMusicDisplay, GraphicalNote } from "opensheetmusicdisplay";
import { ExtendedTransposeCalculator } from "extended-transpose-calculator";
import { WebMidi, Input as MidiInput } from "../WebMidi";
import { ScoreClass, SheetClass, THiddenPart, TMusicXmlObject } from "@Common/DataObjects";
import { ASCSS } from "./ASCSS";
import { SheetNode } from "./SheetNode";
import { ScoreNode } from "./ScoreNode";

ASCSS.MusicScore = {
    "bottom":"0px",
    "display":"block",
    "left":"0px",
    "position":"absolute",
    "right":"0px",
    "top":"0px",
    ">.canvas":{
        "background-color":"#f5f5f5",
        "display":"block",
        "left":"0px",
        "max-height":"100%",
        "max-width":"100%",
        "min-height":"100%",
        "min-width":"100%",
        "overflow":"hidden",
        "overflow-y":"auto",
        "position":"absolute",
        "top":"0px",
    },
    ">.sleeper":{
        "background-color":"rgba(0,0,0,0.5)",
        "display":"block",
        "left":"0px",
        "max-height":"100%",
        "max-width":"100%",
        "min-height":"100%",
        "min-width":"100%",
        "position":"absolute",
        "top":"0px",
        ":before":{
            "content":"'wait'",
            "left":"50%",
            "position":"absolute",
            "top":"50%",
            "transform":"translate(-50%,-50%)",
        },
    },
};

export class MusicScore extends ASCore {
    private sheetNode: SheetNode;
    private osmd: OpenSheetMusicDisplay;
    private etc: ExtendedTransposeCalculator;
    private midiInput: MidiInput;
    private musicXmlId: number = null;

    public $preConnect(): void {
        this.$Elements.canvas = <HTMLDivElement>document.createElement("div");
        this.$Elements.canvas.classList.add("canvas");
        this.appendChild(this.$Elements.canvas);

        this.$Elements.sleeper = <HTMLDivElement>document.createElement("div");
        this.$Elements.sleeper.classList.add("sleeper");
        this.sleeperShow();
        super.$preConnect();
    }

    public get Canvas(): HTMLDivElement {
        return <HTMLDivElement>this.$Elements.canvas;
    }

    public get ETC(): ExtendedTransposeCalculator {
        return this.etc || null;
    }

    public get Id(): number {
        if (this.SheetClass) {
            return this.SheetClass.SheetId;
        }
    }

    public get OSMD(): OpenSheetMusicDisplay {
        return this.osmd || null;
    }

    public get ScoreClass(): ScoreClass {
        if (this.ScoreNode) {
            return this.ScoreNode.ScoreClass;
        } else {
            return null;
        }
    }

    public get MusicXmlId(): number {
        return this.musicXmlId;
    }

    public set MusicXmlId(musicXmlId: number) {
        if (this.musicXmlId !== musicXmlId) {
            this.musicXmlId = musicXmlId
            if (this.ScoreNode && this.ScoreNode.ScoreId === this.musicXmlId) {
                this.update();
            }
        }
    }

    public get ScoreMode(): boolean {
        return this.ScoreNode.DefaultSheet === this.SheetNode;
    }

    public get SheetMode(): boolean {
        return !this.ScoreMode;
    }

    public get ScoreNode(): ScoreNode {
        if (this.SheetNode) {
            return this.SheetNode.ParentScore;
        } else {
            return null;
        }
    }

    public get SheetClass(): SheetClass {
        if (this.SheetNode) {
            return this.SheetNode.SheetClass;
        } else {
            return null;
        }
    }

    public get SheetNode(): SheetNode {
        if (
            this.sheetNode &&
            this.sheetNode instanceof SheetNode
         ){
            return this.sheetNode;
        } else {
            return null;
        }
    }

    public set SheetNode(sheetNode: SheetNode) {
        if (
            sheetNode &&
            sheetNode instanceof SheetNode &&
            this.sheetNode !== sheetNode
         ){
            this.sheetNode = sheetNode;
            this.setAttribute("as-id",String(this.Id));
            this.MusicXmlId = this.ScoreNode.ScoreId;
        }
    }

    public get Sleeper(): HTMLDivElement {
        return <HTMLDivElement>this.$Elements.sleeper;
    }

    public $alwaysConnect(): void {
        super.$alwaysConnect();
        WebMidi.enable().then(() => {
            console.log("WebMidi.js has been enabled!");
            // osmd
            this.osmd = new OpenSheetMusicDisplay(this.Canvas, {
                backend: "svg",
                drawTitle: true,
                drawSubtitle: true,
                disableCursor: false,
                followCursor: true,
            });
            console.log();
            this.etc = new ExtendedTransposeCalculator(this.osmd);
            this.OSMD.TransposeCalculator = this.ETC;
            console.log("this.OSMD, this.ETC)", this.OSMD, this.ETC);
            this.sleeperHide();
        });
    }

    public sleeperHide(): void {
        this.removeChild(this.$Elements.sleeper);
    }

    public sleeperShow(): void {
        this.appendChild(this.$Elements.sleeper);
    }

    public update(): void {
        this.ScoreNode.Library.getMusicXmlObject(this.musicXmlId ).then((musicXmlObject: TMusicXmlObject) =>{
            if (musicXmlObject) {
                this.OSMD.load(musicXmlObject.musicXml).then(() => {
                    this.sleeperShow();
                    // trasposition
                    console.log(this.ETC.Options.OSMD.TransposeCalculator);
                    this.ETC.Options.transposeToKey(this.SheetClass.ActiveKey);
                    console.log(this.SheetClass.MeasureStart);
                    console.log(this.SheetClass.MeasureEnd);
                    this.OSMD.setOptions({
                        measureNumberInterval: 1,
                        drawFromMeasureNumber: this.SheetClass.MeasureStart,
                        drawUpToMeasureNumber: this.SheetClass.MeasureEnd,
                        defaultColorMusic: "#1f1f1f",
                    });
                    // strings
                    if (this.ScoreMode){
                        this.OSMD.Sheet.TitleString = this.ScoreNode.Title;
                        this.OSMD.Sheet.SubtitleString = this.ScoreNode.Subtitle;
                    } else {
                        this.OSMD.Sheet.TitleString = `${this.ScoreNode.Title} - ${this.SheetNode.Title}`;
                        this.OSMD.Sheet.SubtitleString = `${this.ScoreNode.Subtitle} - ${this.SheetNode.Subtitle}`;
                    }
                    this.OSMD.Sheet.ComposerString = this.ScoreNode.Author;
                    //
                    console.log("instruments", this.OSMD.Sheet.Instruments.length);
                    this.OSMD.updateGraphic();

                    Object.keys(this.SheetNode.HiddenParts).forEach((key: string) => {
                        const keyNumber: number = Number(key);
                        this.OSMD.Sheet.Parts[keyNumber].Visible = false;
                        /*
                        console.log("instrument", this.OSMD.Sheet.Instruments[keyNumber].Voices.length);
                        const staves: number[] = this.SheetNode.HiddenParts[key];
                        staves.forEach((staff: number) => {
                            staff = Number(staff);
                            this.OSMD.Sheet.Parts[keyNumber].Voices[staff].Visible = false
                            console.log(
                                this.OSMD.Sheet.Parts[keyNumber].Voices[staff].Visible
                            );
                        });
                        */
                    });
                    for (let i: 0; i < this.OSMD.GraphicSheet.MeasureList.length; i++) {
                        const graphicalNote: any = this.OSMD.GraphicSheet.MeasureList[0][0].staffEntries[0].graphicalVoiceEntries[0].notes[0];
                        console.log(graphicalNote);
                        graphicalNote.getSVGGElement().children[0].children[0].children[0].style.fill = "#FF0000";
                    }
                    this.OSMD.render();
                    const graphicalNote: any = this.OSMD.GraphicSheet.MeasureList[0][0].staffEntries[0].graphicalVoiceEntries[0].notes[0];
                    console.log(graphicalNote);
                    graphicalNote.getSVGGElement().children[0].children[0].children[0].style.fill = "#FF0000";
                    this.sleeperHide();
                });
            }
        });
    }
}

customElements.define("music-score", MusicScore);

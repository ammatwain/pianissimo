import { ASCore } from "./ASCore";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { ExtendedTransposeCalculator } from "extended-transpose-calculator";
import { WebMidi, Input as MidiInput } from "../WebMidi";
import { ScoreClass, SheetClass, TMusicXmlObject } from "@Common/DataObjects";
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
        "bottom":"0px",
        "display":"block",
        "left":"0px",
        "position":"absolute",
        "right":"0px",
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
        this.appendChild(this.$Elements.sleeper);
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
            this.musicXmlId = musicXmlId;
            if (this.ScoreNode && this.ScoreNode.ScoreId === this.musicXmlId) {
                this.ScoreNode.Library.getMusicXmlObject(this.musicXmlId ).then((musicXmlObject: TMusicXmlObject) =>{
                    if (musicXmlObject) {
                        this.OSMD.load(musicXmlObject.musicXml).then(() => {
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

                            this.OSMD.updateGraphic();
                            this.OSMD.render();
                        });
                    }
                });
            }
        }
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

            this.etc = new ExtendedTransposeCalculator(this.osmd);
            this.OSMD.TransposeCalculator = this.ETC;

            this.sleeperHide();
        });
    }

    public sleeperHide(): void {
        this.Sleeper.style.display="none";
    }

    public sleeperShow(): void {
        this.Sleeper.style.display="block";
    }

    public update(): void {

    }
}

customElements.define("music-score", MusicScore);

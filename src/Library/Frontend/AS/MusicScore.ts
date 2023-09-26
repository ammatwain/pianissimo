import { ASCore } from "./ASCore";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { ExtendedTransposeCalculator } from "extended-transpose-calculator";
import { WebMidi, Input as MidiInput } from "../WebMidi";
import { ScoreClass, SheetClass } from "@Library/Common/DataObjects";
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
        "background-color":"rgba(0,0,0,0.5)",
        "bottom":"0px",
        "display":"block",
        "left":"0px",
        "position":"absolute",
        "right":"0px",
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

    public $preConnect(): void {
        super.$preConnect();
        this.$Elements.canvas = <HTMLDivElement>document.createElement("div");
        this.$Elements.canvas.classList.add("canvas");
        this.appendChild(this.$Elements.canvas);

        this.$Elements.sleeper = <HTMLDivElement>document.createElement("div");
        this.$Elements.sleeper.classList.add("sleeper");
        this.appendChild(this.$Elements.sleeper);
    }

    public get Canvas(): HTMLDivElement {
        return <HTMLDivElement>this.$Elements.canvas;
    }

    public get Id(): number {
        if (this.SheetClass) {
            return this.SheetClass.SheetId;
        }
    }

    public get ScoreClass(): ScoreClass {
        if (this.ScoreNode) {
            return this.ScoreNode.ScoreClass;
        } else {
            return null;
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
        if (this.sheetNode && this.sheetNode instanceof SheetNode ){
            return this.SheetNode;
        } else {
            return null;
        }
    }

    public set SheetNode(sheetNode: SheetNode) {
        if (sheetNode && sheetNode instanceof SheetNode ){
            this.sheetNode = sheetNode;
            this.setAttribute("as-id",String(this.Id));
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

            this.etc = new ExtendedTransposeCalculator(this.osmd );

            this.sleeperHide();
        });
    }

    public sleeperHide(): void {
        this.Sleeper.style.display="none";
    }

    public sleeperShow(): void {
        this.Sleeper.style.display="block";
    }

}

customElements.define("music-sheet", MusicScore);

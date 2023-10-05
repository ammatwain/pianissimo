import { ASCore } from "./ASCore";
import { ScoreClass, SheetClass, THiddenPart, TMusicXmlObject } from "@Common/DataObjects";
import { ASCSS } from "./ASCSS";
import { SheetNode } from "./SheetNode";
import { ScoreNode } from "./ScoreNode";
import { Maestro } from "../Maestro";

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
    private maestro: Maestro;
    private sheetNode: SheetNode;
    private musicXmlId: number = null;

    public $alwaysConnect(): void {
        super.$alwaysConnect();
        this.maestro = new Maestro(this);
    }

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

    public get MusicXmlId(): number {
        return this.musicXmlId;
    }

    public set MusicXmlId(musicXmlId: number) {
        //if (this.musicXmlId !== musicXmlId) {
            this.musicXmlId = musicXmlId;
            if (this.ScoreNode && this.ScoreNode.ScoreId === this.musicXmlId) {
                this.update();
            }
        //}
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

    public sleeperHide(): void {
        this.removeChild(this.$Elements.sleeper);
    }

    public sleeperShow(): void {
        this.appendChild(this.$Elements.sleeper);
    }

    public update(): void {
        this.ScoreNode.Library.getMusicXmlObject(this.musicXmlId ).then((musicXmlObject: TMusicXmlObject) =>{
            if (musicXmlObject) {
                this.maestro.loadXmlSheet(musicXmlObject.musicXml, this.SheetNode);
/*
                this.maestro.OSMD.load(musicXmlObject.musicXml).then(() => {
                    this.sleeperShow();
                    // trasposition
                    this.maestro.ETC.Options.transposeToKey(this.SheetClass.ActiveKey);
                    this.maestro.OSMD.HiddenParts = this.SheetClass.HiddenParts;
                    this.maestro.OSMD.MeasureStart = this.SheetClass.MeasureStart;
                    this.maestro.OSMD.MeasureEnd = this.SheetClass.MeasureEnd;

                    this.maestro.OSMD.setOptions({
                        measureNumberInterval: 1,
                        //drawFromMeasureNumber: this.SheetClass.MeasureStart,
                        //drawUpToMeasureNumber: this.SheetClass.MeasureEnd,
                        //defaultColorMusic: "#1f1f1f",
                    });
                    // strings
                    if (this.ScoreMode){
                        this.maestro.OSMD.Sheet.TitleString = this.ScoreNode.Title;
                        this.maestro.OSMD.Sheet.SubtitleString = this.ScoreNode.Subtitle;
                    } else {
                        this.maestro.OSMD.Sheet.TitleString = `${this.ScoreNode.Title} - ${this.SheetNode.Title}`;
                        this.maestro.OSMD.Sheet.SubtitleString = `${this.ScoreNode.Subtitle} - ${this.SheetNode.Subtitle}`;
                    }
                    this.maestro.OSMD.Sheet.ComposerString = this.ScoreNode.Author;
                    this.maestro.OSMD.updateGraphic();
                    this.maestro.OSMD.render();
                    this.maestro.reset();
                    //sthis.maestro.OSMD.cursor.show();
                    this.sleeperHide();
                });
*/
            }
        });
    }
}

customElements.define("music-score", MusicScore);

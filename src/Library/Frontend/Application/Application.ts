import { LibraryNode } from "../AS/LibraryNode";
import { TRackObject } from "@Library/Common/DataObjects/TRackObject";
import { TScoreObject } from "@Library/Common/DataObjects/TScoreObject";
import { TSheetObject } from "@Common/DataObjects/TSheetObject";
import { Library } from "../Library/Library";
import { MusicScore } from "../AS/MusicScore";
import { Package } from "@Library/Backend/Package";

import "./Application.scss";

export class AppPianissimo {
    private header: HTMLDivElement;
    private footer: HTMLDivElement;
    private left: HTMLDivElement;
    private right: HTMLDivElement;
    private main: HTMLDivElement;
    private musicScore: MusicScore;
    private library: any;

    constructor(){
        this.setListeners();
    }

    public get Name(): string {
        return Package.name;
    }
    buildTree(data: any): void {
//        console.log(data);
        Library.LibraryName = data.libraryName;

        const root: LibraryNode = Library.RootNode;

        this.left.appendChild(root);

        data.racks.forEach((rack: TRackObject)=>{
            Library.addRack(rack.rackId, rack);
        });
        data.scores.forEach((score: TScoreObject)=>{
            Library.addScore(score.scoreId, score);
        });
        data.sheets.forEach((sheet: TSheetObject)=>{
            Library.addSheet(sheet.sheetId, sheet);
        });

        Library.buildTree();
    }

    setListeners(): void{
        document.addEventListener("DOMContentLoaded",(event: Event)=>{
            this.header = <HTMLDivElement>document.querySelector("#header");
            this.footer = <HTMLDivElement>document.querySelector("#footer");
            this.left = <HTMLDivElement>document.querySelector("#left");
            this.right = <HTMLDivElement>document.querySelector("#right");
            this.main = <HTMLDivElement>document.querySelector("#main");
            window.electron.ipcRenderer.invoke("request-library-index").then((result: any)=>{
                this.library = result;
                this.buildTree(this.library);
            });
            this.musicScore = new MusicScore();
            this.main.appendChild(this.musicScore);
        });
    }
}

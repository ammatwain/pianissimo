import { RackNode, ScoreNode, SheetNode } from "@Frontend/AS";
import "./Application.scss";
import { LibraryNode } from "../AS/LibraryNode";
import { TRackObject } from "@Library/Common/DataObjects/TRackObject";
import { TScoreObject } from "@Library/Common/DataObjects/TScoreObject";
import { TSheetObject } from "@Common/DataObjects/TSheetObject";
import { LibraryClass } from "@Library/Common/DataObjects/LibraryClass";
import { RackClass } from "@Common/DataObjects/RackClass";
import { ScoreClass } from "@Common/DataObjects/ScoreClass";
import { SheetClass } from "@Common/DataObjects/SheetClass";
import { Library } from "../Library/Library";

export class Application {
    private header: HTMLDivElement;
    private footer: HTMLDivElement;
    private left: HTMLDivElement;
    private right: HTMLDivElement;
    private main: HTMLDivElement;
    private library: any;

    constructor(){
        this.setListeners();
    }

    buildTree(data: any): void {
        console.log(data);
//        const root: LibraryNode = new LibraryNode({library: data, Library: this.library, caption: "TEST"});
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

/*
        data.rackClasses=[];
        data.scoreClasses=[];
        data.sheetClasses=[];
        data.rackNodes=[];
        data.scoreNodes=[];
        data.sheetNodes=[];
        data.racks.forEach((rack: TRackObject)=>{
            Library.setRackObject(rack.rackId, rack);
            data.rackClasses.push(new RackClass(rack));
        });

        data.rackClasses.forEach((rack: RackClass)=>{
            data.rackNodes.push(new RackNode(rack,null));
        });

        data.rackNodes.forEach((rackNode: RackNode)=>{
            if (rackNode.ParentRackId===0){
                root.$appendNode(rackNode);
            } else {
                const parent: RackNode = data.rackNodes.find((parentNode: RackNode)=>{
                    return parentNode.RackId === rackNode.ParentRackId;
                });
                if (parent){
                    parent.$appendNode(rackNode);
                }
            }
        });

        data.scores.forEach((score: TScoreObject)=>{
            data.scoreClasses.push(new ScoreClass(score));
        });

        data.scoreClasses.forEach((score: ScoreClass)=>{
            data.scoreNodes.push(new ScoreNode(score,null));
        });

        data.scoreNodes.forEach((scoreNode: ScoreNode)=>{
            if (scoreNode.ParentRackId===0){
                root.$appendNode(scoreNode);
            } else {
                const parent: RackNode = data.rackNodes.find((parentNode: RackNode)=>{
                    return parentNode.RackId === scoreNode.ParentRackId;
                });
                if (parent){
                    parent.$appendNode(scoreNode);
                }
            }
        });

        data.sheets.forEach((sheet: TScoreObject)=>{
            data.sheetClasses.push(new SheetClass(sheet));
        });

        data.sheetClasses.forEach((sheet: SheetClass)=>{
            data.sheetNodes.push(new SheetNode(sheet,null));
        });
        data.sheetNodes.forEach((sheetNode: SheetNode)=>{
            if (sheetNode.ParentScoreId===0){
                //root.$appendNode(scoreNode);
            } else {
                const parent: ScoreNode = data.scoreNodes.find((parentNode: ScoreNode)=>{
                    return parentNode.ScoreId === sheetNode.ParentScoreId;
                });
                if (parent){
                    parent.$appendNode(sheetNode);
                }
            }
        });
    */
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
        });
    }
}

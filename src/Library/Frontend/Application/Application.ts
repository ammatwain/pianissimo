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

    buildTree(library: any): void {
        console.log(library);
        const root: LibraryNode = new LibraryNode({caption: "TEST"});
        this.left.appendChild(root);
        library.rackClasses=[];
        library.scoreClasses=[];
        library.sheetClasses=[];
        library.rackNodes=[];
        library.scoreNodes=[];
        library.sheetNodes=[];

        library.racks.forEach((rack: TRackObject)=>{
            library.rackClasses.push(new RackClass(rack));
        });

        library.rackClasses.forEach((rack: RackClass)=>{
            library.rackNodes.push(new RackNode(rack,null));
        });

        library.rackNodes.forEach((rackNode: RackNode)=>{
            if (rackNode.ParentRackId===0){
                root.$appendNode(rackNode);
            } else {
                const parent: RackNode = library.rackNodes.find((parentNode: RackNode)=>{
                    return parentNode.RackId === rackNode.ParentRackId;
                });
                if (parent){
                    parent.$appendNode(rackNode);
                }
            }
        });

        library.scores.forEach((score: TScoreObject)=>{
            library.scoreClasses.push(new ScoreClass(score));
        });

        library.scoreClasses.forEach((score: ScoreClass)=>{
            library.scoreNodes.push(new ScoreNode(score,null));
        });

        library.scoreNodes.forEach((scoreNode: ScoreNode)=>{
            if (scoreNode.ParentRackId===0){
                root.$appendNode(scoreNode);
            } else {
                const parent: RackNode = library.rackNodes.find((parentNode: RackNode)=>{
                    return parentNode.RackId === scoreNode.ParentRackId;
                });
                if (parent){
                    parent.$appendNode(scoreNode);
                }
            }
        });

        library.sheets.forEach((sheet: TScoreObject)=>{
            library.sheetClasses.push(new SheetClass(sheet));
        });

        library.sheetClasses.forEach((sheet: SheetClass)=>{
            library.sheetNodes.push(new SheetNode(sheet,null));
        });
        library.sheetNodes.forEach((sheetNode: SheetNode)=>{
            if (sheetNode.ParentScoreId===0){
                //root.$appendNode(scoreNode);
            } else {
                const parent: ScoreNode = library.scoreNodes.find((parentNode: ScoreNode)=>{
                    return parentNode.ScoreId === sheetNode.ParentScoreId;
                });
                if (parent){
                    parent.$appendNode(sheetNode);
                }
            }
        });
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

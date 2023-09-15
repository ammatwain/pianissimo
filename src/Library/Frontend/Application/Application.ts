import { RackNode, ScoreNode, SheetNode } from "@Frontend/AS";
import "./Application.scss";
import { LibraryNode } from "../AS/LibraryNode";
import { IRackFields, IScoreFields, ISheetFields } from "@Library/Common/DataObjects";

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

    buildTree(library: any): void {
        console.log(library);
        const root: LibraryNode = new LibraryNode({caption: "TEST"});
        this.left.appendChild(root);
        library.rackNodes=[];
        library.scoreNodes=[];
        library.sheetNodes=[];
        library.racks.forEach((rack: IRackFields)=>{
            library.rackNodes.push(new RackNode(rack,null));
        });
        library.rackNodes.forEach((rackNode: RackNode)=>{
            console.log(rackNode.ParentRackId);
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

        library.scores.forEach((score: IScoreFields)=>{
            library.scoreNodes.push(new ScoreNode(score,null));
        });
        library.scoreNodes.forEach((scoreNode: ScoreNode)=>{
            console.log(scoreNode.RackId);
            if (scoreNode.RackId===0){
                root.$appendNode(scoreNode);
            } else {
                const parent: RackNode = library.rackNodes.find((parentNode: RackNode)=>{
                    return parentNode.RackId === scoreNode.RackId;
                });
                if (parent){
                    parent.$appendNode(scoreNode);
                }
            }
        });
        library.sheets.forEach((sheet: ISheetFields)=>{
            library.sheetNodes.push(new SheetNode(sheet,null));
        });
        library.sheetNodes.forEach((sheetNode: SheetNode)=>{
            console.log(sheetNode.ScoreId);
            if (sheetNode.ScoreId===0){
                //root.$appendNode(scoreNode);
            } else {
                const parent: ScoreNode = library.scoreNodes.find((parentNode: ScoreNode)=>{
                    return parentNode.ScoreId === sheetNode.ScoreId;
                });
                if (parent){
                    parent.$appendNode(sheetNode);
                }
            }
        });
    }
}

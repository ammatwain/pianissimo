import { LibraryClass } from "@DataObjects/LibraryClass";
import { RackClass } from "@DataObjects/RackClass";
import { ScoreClass } from "@DataObjects/ScoreClass";
import { SheetClass } from "@DataObjects/SheetClass";
import { TLibraryObject } from "@DataObjects/TLibraryObject";
import { TRackObject } from "@DataObjects/TRackObject";
import { TScoreObject } from "@DataObjects/TScoreObject";
import { TSheetObject } from "@DataObjects/TSheetObject";
import { LibraryNode } from "@Frontend/AS/LibraryNode";
import { RackNode } from "@Frontend/AS/RackNode";
import { ScoreNode } from "@Frontend/AS/ScoreNode";
import { SheetNode } from "@Frontend/AS/SheetNode";
import { ASNode } from "../AS";

class LibraryObjectMap extends Map<number, TLibraryObject> {};
class RackObjectMap extends Map<number, TRackObject> {
};
class ScoreObjectMap extends Map<number, TScoreObject> {};
class SheetObjectMap extends Map<number, TSheetObject> {};
class LibraryClassMap extends Map<number, LibraryClass> {};
class RackClassMap extends Map<number, RackClass> {};
class ScoreClassMap extends Map<number, ScoreClass> {};
class SheetClassMap extends Map<number, SheetClass> {};
class LibraryNodesMap extends Map<number, LibraryNode> {};
class RackNodesMap extends Map<number, RackNode> {};
class ScoreNodesMap extends Map<number, ScoreNode> {};
class SheetNodesMap extends Map<number, SheetNode> {};

export class TLibrary {
    private libraryObjects: LibraryObjectMap;
    private rackObjects: RackObjectMap;
    private scoreObjects: ScoreObjectMap;
    private sheetObjects: SheetObjectMap;
    private libraryClasses: LibraryClassMap;
    private rackClasses: RackClassMap;
    private scoreClasses: ScoreClassMap;
    private sheetClasses: SheetClassMap;
    private libraryNodes: LibraryNodesMap;
    private rackNodes: RackNodesMap;
    private scoreNodes: ScoreNodesMap;
    private sheetNodes: SheetNodesMap;

    constructor(){
        this.libraryObjects = new LibraryObjectMap();
        this.rackObjects = new RackObjectMap();
        this.scoreObjects = new ScoreObjectMap();
        this.sheetObjects = new SheetObjectMap();
        this.libraryClasses = new LibraryClassMap();
        this.rackClasses = new RackClassMap();
        this.scoreClasses = new ScoreClassMap();
        this.sheetClasses = new SheetClassMap();
        this.libraryNodes = new LibraryNodesMap();
        this.rackNodes = new RackNodesMap();
        this.scoreNodes = new ScoreNodesMap();
        this.sheetNodes = new SheetNodesMap();
        this.RootNode =  new LibraryNode({library: this, caption: "Library"});
        console.log(this.RootNode);
    }

    public get LibraryObjects(): LibraryObjectMap {
        return this.libraryObjects;
    }

    public get RackObjects(): RackObjectMap {
        return this.rackObjects;
    }

    public get ScoreObjects(): ScoreObjectMap {
        return this.scoreObjects;
    }

    public get SheetObjects(): SheetObjectMap {
        return this.sheetObjects;
    }

    public get LibraryClasses(): LibraryClassMap {
        return this.libraryClasses;
    }

    public get RackClasses(): RackClassMap {
        return this.rackClasses;
    }

    public get ScoreClasses(): ScoreClassMap {
        return this.scoreClasses;
    }

    public get SheetClasses(): SheetClassMap {
        return this.sheetClasses;
    }

    public get LibraryNodes(): LibraryNodesMap {
        return this.libraryNodes;
    }

    public get RackNodes(): RackNodesMap {
        return this.rackNodes;
    }

    public get RootNode(): LibraryNode {
        return this.LibraryNodes.get(0);
    }

    public set RootNode(node: LibraryNode){
        this.LibraryNodes.set(0,node);
    }

    public get ScoreNodes(): ScoreNodesMap {
        return this.scoreNodes;
    }

    public get SheetNodes(): SheetNodesMap {
        return this.sheetNodes;
    }

    setLibraryObject(id: number, obj: TLibraryObject): TLibrary {
        this.LibraryObjects.set(id,obj);
        return this;
    }

    addRack(id: number, rackObject: TRackObject): TLibrary {
        if (!this.LibraryObjects.has(id)){
            this.setRackObject(id,rackObject);
            if (!this.LibraryClasses.has(id)){
                const rackClass: RackClass = new RackClass(rackObject);
                this.setRackClass(id,rackClass);
                if (!this.LibraryNodes.has(id)){
                    const rackNode: RackNode = new RackNode(rackClass, null);
                    this.setRackNode(id,rackNode);
                }
            }
        }
        return this;
    }

    addScore(id: number, scoreObject: TScoreObject): TLibrary{
        if (!this.LibraryObjects.has(id)){
            this.setScoreObject(id,scoreObject);
            if (!this.LibraryClasses.has(id)){
                const scoreClass: ScoreClass = new ScoreClass(scoreObject);
                this.setScoreClass(id,scoreClass);
                if (!this.LibraryNodes.has(id)){
                    const scoreNode: ScoreNode = new ScoreNode(scoreClass, null);
                    this.setScoreNode(id,scoreNode);
                }
            }
        }
        return this;
    }

    addSheet(id: number, sheetObject: TSheetObject): TLibrary {
        if (!this.LibraryObjects.has(id)){
            this.setSheetObject(id,sheetObject);
            if (!this.LibraryClasses.has(id)){
                const sheetClass: SheetClass = new SheetClass(sheetObject);
                this.setSheetClass(id,sheetClass);
                if (!this.LibraryNodes.has(id)){
                    const sheetNode: SheetNode = new SheetNode(sheetClass, null);
                    this.setSheetNode(id,sheetNode);
                }
            }
        }
        return this;
    }

    deleteRack(id: number): TLibrary {
        const rackNode: RackNode = this.RackNodes.get(id);
        if (rackNode) {
            rackNode.$selfRemove();
        }
        this.LibraryNodes.delete(id);
        this.RackNodes.delete(id);
        this.LibraryClasses.delete(id);
        this.RackClasses.delete(id);
        this.LibraryObjects.delete(id);
        this.RackObjects.delete(id);
        return this;
    }

    deleteScore(id: number): TLibrary {
        const scoreNode: ScoreNode = this.ScoreNodes.get(id);
        if (scoreNode) {
            scoreNode.$selfRemove();
        }
        this.LibraryNodes.delete(id);
        this.ScoreNodes.delete(id);
        this.LibraryClasses.delete(id);
        this.ScoreClasses.delete(id);
        this.LibraryObjects.delete(id);
        this.ScoreObjects.delete(id);
        return this;
    }

    deleteSheet(id: number): TLibrary {
        const sheetNode: SheetNode = this.SheetNodes.get(id);
        if (sheetNode) {
            sheetNode.$selfRemove();
        }
        this.LibraryNodes.delete(id);
        this.SheetNodes.delete(id);
        this.LibraryClasses.delete(id);
        this.SheetClasses.delete(id);
        this.LibraryObjects.delete(id);
        this.SheetObjects.delete(id);
        return this;
    }

    insertRack(rackObject: TRackObject): TLibrary {
        const id: number =  rackObject.rackId;
        if (!this.LibraryObjects.has(id)){
            this.setRackObject(id,rackObject);
            if (!this.LibraryClasses.has(id)){
                const rackClass: RackClass = new RackClass(rackObject);
                this.setRackClass(id,rackClass);
                if (!this.LibraryNodes.has(id)){
                    let rackNode: RackNode;
                    if (rackClass.ParentRackId>0){
                        const parentRackNode: RackNode =  this.RackNodes.get(rackClass.ParentRackId) || null;
                        rackNode = new RackNode(rackClass, parentRackNode);
                    } else if (rackClass.ParentRackId === 0 && this.RootNode) {
                        rackNode = new RackNode(rackClass, this.RootNode);
                    } else {
                        rackNode = new RackNode(rackClass, null);
                    }
                    this.setRackNode(id,rackNode);
                }
            }
        }
        return this;
    }

    insertScore(id: number, scoreObject: TScoreObject): TLibrary{
        if (!this.LibraryObjects.has(id)){
            this.setScoreObject(id,scoreObject);
            if (!this.LibraryClasses.has(id)){
                const scoreClass: ScoreClass = new ScoreClass(scoreObject);
                this.setScoreClass(id,scoreClass);
                if (!this.LibraryNodes.has(id)){
                    let scoreNode: ScoreNode;
                    if (scoreClass.ParentRackId>0){
                        const parentRackNode: RackNode =  this.RackNodes.get(scoreClass.ParentRackId) || null;
                        scoreNode = new ScoreNode(scoreClass, parentRackNode);
                    } else if (scoreClass.ParentRackId === 0 && this.RootNode) {
                        scoreNode = new ScoreNode(scoreClass, this.RootNode);
                    } else {
                        scoreNode = new ScoreNode(scoreClass, null);
                    }
                    this.setScoreNode(id,scoreNode);
                }
            }
        }
        return this;
    }

    insertSheet(id: number, sheetObject: TSheetObject): TLibrary {
        if (!this.LibraryObjects.has(id)){
            this.setSheetObject(id,sheetObject);
            if (!this.LibraryClasses.has(id)){
                const sheetClass: SheetClass = new SheetClass(sheetObject);
                this.setSheetClass(id,sheetClass);
                if (!this.LibraryNodes.has(id)){
                    let sheetNode: SheetNode;
                    if (sheetClass.ParentScoreId>0){
                        const parentScoreNode: ScoreNode =  this.ScoreNodes.get(sheetClass.ParentScoreId) || null;
                        sheetNode = new SheetNode(sheetClass, parentScoreNode);
                    } else {
                        sheetNode = new SheetNode(sheetClass, null);
                    }
                    this.setSheetNode(id,sheetNode);
                }
            }
        }
        return this;
    }


    setRackObject(id: number, rackObject: TRackObject): TLibrary {
        this.LibraryObjects.set(id,rackObject);
        this.RackObjects.set(id,rackObject);
        return this;
    }

    setScoreObject(id: number, scoreObject: TScoreObject): TLibrary{
        this.LibraryObjects.set(id,scoreObject);
        this.ScoreObjects.set(id,scoreObject);
        return this;
    }

    setSheetObject(id: number, sheetObject: TSheetObject): TLibrary {
        this.LibraryObjects.set(id,sheetObject);
        this.SheetObjects.set(id,sheetObject);
        return this;
    }

    setLibraryClass(id: number, clss: LibraryClass): TLibrary {
        this.LibraryClasses.set(id,clss);
        return this;
    }

    setRackClass(id: number, clss: RackClass): TLibrary {
        this.LibraryClasses.set(id,clss);
        this.RackClasses.set(id,clss);
        return this;
    }

    setScoreClass(id: number, clss: ScoreClass): TLibrary {
        this.LibraryClasses.set(id,clss);
        this.ScoreClasses.set(id,clss);
        return this;
    }

    setSheetClass(id: number, clss: SheetClass): TLibrary {
        this.LibraryClasses.set(id,clss);
        this.SheetClasses.set(id,clss);
        return this;
    }

    setLibraryNode(id: number, node: LibraryNode): TLibrary {
        this.LibraryNodes.set(id,node);
        return this;
    }

    setRackNode(id: number, node: RackNode): TLibrary {
        this.LibraryNodes.set(id,node);
        this.RackNodes.set(id,node);
        return this;
    }

    getScoreNode(id: number): ScoreNode {
        if (this.ScoreNodes.has(id)){
            return this.ScoreNodes.get(id);
        }
        return null;
    }

    setScoreNode(id: number, node: ScoreNode): TLibrary {
        this.LibraryNodes.set(id,node);
        this.ScoreNodes.set(id,node);
        return this;
    }

    setSheetNode(id: number, node: SheetNode): TLibrary {
        this.LibraryNodes.set(id,node);
        this.SheetNodes.set(id,node);
        return this;
    }

    public deleteLibraryObject(id: number): void {
        const libraryNode: LibraryNode = this.LibraryNodes.get(id);
        if (libraryNode && libraryNode instanceof LibraryNode) {
            window.electron.ipcRenderer.invoke("request-consens-for-library-object-deletion", id ).then((result: TLibraryObject)=>{
                if (libraryNode && libraryNode instanceof LibraryNode) {
                    const deletableSheets: number[] = [];
                    const deletableScores: number[] = [];
                    const deletableRacks: number[] = [];
                    libraryNode.getAllChildren().forEach((item: {class: string, node: LibraryNode}) => {
                        if (item.class==="SheetNode") {
                            this.deleteSheet((<SheetNode>item.node).SheetId);
                            deletableSheets.push((<SheetNode>item.node).SheetId);
                        } else if(item.class==="ScoreNode"){
                            this.deleteScore((<ScoreNode>item.node).ScoreId);
                            deletableScores.push((<ScoreNode>item.node).ScoreId);
                        } else if(item.class==="RackNode"){
                            this.deleteRack((<RackNode>item.node).RackId);
                            deletableRacks.push((<RackNode>item.node).RackId);
                        }
                    });
                    window.electron.ipcRenderer.invoke(
                        "request-delete-library-objects",
                        {
                            sheetIds: deletableSheets,
                            scoreIds: deletableScores,
                            rackIds: deletableRacks,
                        }
                    ).then((deleteResult: boolean)=>{
                        console.log("deleted", deleteResult);
                    });
                }
            });
        }
    }

    public newRackObject(parentId: number = 0, sequence: number = 0): void {
        const rackObject: TRackObject = {
            rackId: Number(`2${Date.now()}`),
            parentRackId: parentId,
            sequence: sequence,
            status: null,
            title: `Default Title #${sequence}`,
        };
        console.log(rackObject);

        window.electron.ipcRenderer.invoke("request-insert-rack", rackObject ).then((result: TRackObject)=>{
            if (
                result &&
                rackObject.rackId === result.rackId &&
                rackObject.parentRackId === result.parentRackId
            ) {
                this.insertRack(result);
            }
        });
    }

    public newScoreObject(parentId: number = 0, sequence: number = 0): void {
        const scoreObject: TScoreObject = {
            scoreId: Number(`3${Date.now()}`),
            parentRackId: parentId,
            sequence: sequence,
            status: "",
            title: `Default Title #${sequence}`,
            subtitle: "",
            author: "",
            measures: null,
            parts: null,
            mainKey: null,
            mainTempo: null,
        };

        window.electron.ipcRenderer.invoke("request-add-score", scoreObject ).then((result: any)=>{
            if (
                result &&
                result.score &&
                result.sheet &&
                result.zipped
            ) {
                this.insertScore(result.score.scoreId, result.score );
                this.insertSheet(result.sheet.sheetId, result.sheet );
                console.log(result);
            }
        });
    }

    public newSheetObject(parentId: number = 0, sequence: number = 0): void {
        const sheetObject: TSheetObject = {
            sheetId: Number(`4${Date.now()}`),
            parentScoreId: parentId,
            sequence: sequence,
            status: "",
            title: `Default Title #${sequence}`,
            subtitle: "",
            activeKey: null,
            activeKeys: null,
            measureStart: null,
            measureEnd: null,
            selectedParts: null,
            selectedStaves: null,
            transposeBy: null,
            shot: null,
            done: null,
            loop: null,
        };

        window.electron.ipcRenderer.invoke("request-add-sheet", sheetObject ).then((result: any)=>{
            if (
                result &&
                result.sheet
            ) {
                this.insertSheet(result.sheet.sheetId, result.sheet );
                console.log(result);
            }
        });
    }

    buildTree(): TLibrary {
        if (
            this.RootNode &&
            this.RootNode instanceof LibraryNode &&
            this.RackNodes.size &&
            this.ScoreNodes.size &&
            this.SheetNodes.size
        ) {
            this.RackNodes.forEach((rackNode: RackNode)=>{
                if (rackNode.ParentRackId===0){
                    this.RootNode.$appendNode(rackNode);
                } else {
                    const parent: RackNode = this.RackNodes.get(rackNode.ParentRackId);
                    if (rackNode.ParentRackId===21693149332714){
                        console.log("rackNode.ParentRack", rackNode.ParentRackId, parent);
                    }

                    if (parent){
                        parent.$appendNode(rackNode, false);
                    }
                }
            });

            console.log("RackNodes Completed");

            this.ScoreNodes.forEach((scoreNode: ScoreNode)=>{
                console.log(scoreNode.ParentRackId);
                if (scoreNode.ParentRackId===0){
                    this.RootNode.$appendNode(scoreNode, false);
                } else {
                    const parent: RackNode = this.RackNodes.get(scoreNode.ParentRackId);
                    if (parent){
                        parent.$appendNode(scoreNode, false);
                    } else {
                        throw new Error("ERRORE NEL PARENT RACK ID");
                    }
                }
            });

            this.SheetNodes.forEach((sheetNode: SheetNode)=>{
                if (sheetNode.ParentScoreId===0){
                    //root.$appendNode(scoreNode);
                } else {
                    const parent: ScoreNode = this.getScoreNode(sheetNode.ParentScoreId);
                    if (parent){
                        parent.$appendNode(sheetNode, false);
                    }
                }
            });

        }
        return this;
    }
}

export const Library: TLibrary = new TLibrary();

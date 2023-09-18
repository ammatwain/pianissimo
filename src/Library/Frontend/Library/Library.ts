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

class LibraryObjectMap extends Map<number, TLibraryObject> {};
class RackObjectMap extends Map<number, TRackObject> {};
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
                    const parent: RackNode = this.rackNodes.get(rackNode.ParentRackId);
                    if (parent){
                        parent.$appendNode(rackNode);
                    }
                }
            });
        }
        return this;
    }
}

export const Library: TLibrary = new TLibrary();
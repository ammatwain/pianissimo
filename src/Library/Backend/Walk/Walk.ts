import { BranchClass } from "../../../Library/Frontend/BranchClass";
import { IBranchObject, IWalk} from "../../Common";

export class Walk implements IWalk{

    private treeObjects: IBranchObject[] = [];
    private linearObjects: IBranchObject[] = [];
    private linearClasses: BranchClass[] = [];
    private treeClasses: BranchClass[] = [];

    constructor(branches: IBranchObject[] = []){
        this.linearObjects = branches;
        this.treeObjects = this.genealogicalTreeObjects(0);
        this.treeClasses = this.genealogicalTreeClasses(this.treeObjects);
        //this.linearClasses è prodotta da this.genealogicalTreeClasses(this.treeObjects);
    }


    private jsonStringifyReplacer(key: string, value: any): any{
        if (key==="$parent") {
            return undefined;
        }
        return value;
    }

    private genealogicalTreeObjects(parentid: number = 0): IBranchObject[] {
        const result: IBranchObject[] = [];
        const $parent: IBranchObject = this.LinearObjects.find((branch: IBranchObject)=>{
            return branch.id === parentid;
        }) || null;
        this.LinearObjects.filter((branch: IBranchObject)=>{
            return branch.parentid === parentid;
        }).sort((a: IBranchObject, b: IBranchObject)=>{
            return a.sequence - b.sequence;
        }).forEach((branch: IBranchObject)=>{
            const children: IBranchObject[] =  this.genealogicalTreeObjects(branch.id);
            if (children.length) {
                branch.$children = children;
            }
            branch.$parent = $parent;
            result.push(branch);
        });
        return result;
    }

    private genealogicalTreeClasses(genealogicalTreeObjects: IBranchObject[], parentBranchClass: BranchClass = null): BranchClass[] {
        const result: BranchClass[] = [];
        genealogicalTreeObjects.sort((a: IBranchObject, b: IBranchObject)=>{
            return a.sequence - b.sequence;
        }).forEach((branch: IBranchObject)=>{
            const branchClass: BranchClass = new BranchClass(branch, parentBranchClass);
            if (branch.$children && branch.$children.length) {
                branchClass.children = this.genealogicalTreeClasses(branch.$children, branchClass);
            }
            result.push(branchClass);
            this.linearClasses.push(branchClass);
        });
        return result;
    }

    public get TreeObjects(): IBranchObject[] {
        return this.treeObjects;
    }

    public get LinearObjects(): IBranchObject[] {
        return this.linearObjects.sort((a: IBranchObject, b: IBranchObject)=>{
            return a.id - b.id;
        });
    }

    public get TreeClasses(): BranchClass[] {
        return this.treeClasses;
    }

    public get LinearClasses(): BranchClass[] {
        return this.linearClasses.sort((a: BranchClass, b: BranchClass)=>{
            return a.id - b.id;
        });
    }

    public get TreeAsJSONString(): string {
        return JSON.stringify(this.TreeObjects,this.jsonStringifyReplacer,2);
    }

    public get LinearAsJSONString(): string {
        return JSON.stringify(this.LinearObjects,this.jsonStringifyReplacer,2);
    }

}

import { STR } from "../../Global/STR";
import { IVariableCOFNumberArray, IFixedCOFNumberArray } from "../../Common/Interfaces";
import { IBranchObject } from "../../Common/Interfaces/IBranchObject";
import { IBranchType } from "../../Common/Interfaces/IBranchType";
import { IBranchCustom } from "../../Common/Interfaces/IBranchCustom";

type KOC = keyof IBranchCustom;

export class BranchClass{
    private _parent: BranchClass;
    private _children: BranchClass[];
    private _branchObject: IBranchObject;
    private _branchCustomFreezed: string;
    private _HTMLLiElement: HTMLLIElement;
    private _customIsModified: boolean = false;

    rnd(max: number): number  {
        return Math.floor(Math.random() * max);
    }

    constructor(branch: IBranchObject, parent: BranchClass = null) {
        this.parent =  parent;
        this._branchObject = branch;
        this._branchCustomFreezed = JSON.stringify(this._branchObject.custom);
        // in questo momento custom potrebbe essere una stringa;
        if (typeof this._branchObject.custom === "string") {
            this._branchObject.custom = JSON.parse(this._branchObject.custom) ||  {};
        }
        if (this.type === STR.sheet ) {
            this.activeKeys=[-2, +1, +5];
        }
        if (this.type===STR.section){
            this.shot = [
                [
                    this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
                    this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
                    this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
                ],[
                    this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
                    this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
                    this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
                ]
            ];
            this.done = [
                [
                    this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
                    this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
                    this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
                ],
                [
                    this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
                    this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
                    this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
                ]
            ];
        }
    }

    public saveCustom(): IBranchObject {
        if (this.modified) {
            window.electron.ipcRenderer.invoke("request-save-branch-custom", this.id, this.branchObject.custom ).then((result: IBranchCustom)=>{
                this.branchObject.custom = result;
                console.log(result);
            });
        }
        return this.branchObject;
    }

    private get modified(): boolean {
        this._customIsModified = this._customIsModified || (this._branchCustomFreezed !== JSON.stringify(this._branchObject));
        return this._customIsModified;
    }

    public get root(): BranchClass {
        if(this.parent!== null || this.parentid===0) {
            return this;
        } else {
            return this.parent.root;
        }
    }

    public closest(type: IBranchType): BranchClass {
        if(this.type===type) {
            return this;
        } else if (this.parent) {
            return this.parent.closest(type);
        } else {
            return null;
        }
    }

    public child(type: IBranchType): BranchClass {
        let child: BranchClass = null;
        if(this.type === type) {
            child = this;
        } else if (this.children.length) {
            for(let i: number = 0 ; i < this.children.length; i++) {
                if (this.children[i].type===type) {
                    child = this.children[i];
                    break;
                } else {
                    child = this.children[i].child(type);
                }
            }
        }
        return child;
    }

    public get HTMLLiElement(): HTMLLIElement {
        return this._HTMLLiElement;
    }

    public set HTMLLiElement(value: HTMLLIElement) {
        this._HTMLLiElement = value;
    }

    public get level(): number {
        if (this.parent){
            return this.parent.level + 1;
        } else {
            return 0;
        }
    }

    public get branchObject(): IBranchObject {
        return this._branchObject || null;
    }

    private set branchObject(value: IBranchObject) {
        this._branchObject = value || null;
    }

    public get parent(): BranchClass {
        return this._parent || null;
    }

    public set parent(value: BranchClass) {
        this._parent = value || null;
    }

    public get children(): BranchClass[] {
        return this._children || [];
    }

    public set children(value: BranchClass[]) {
        this._children = value || [];
    }

    public get id(): number {
        return Number(this.branchObject.id) || 0;
    }

    public set id(value: number) {
        this.branchObject.id = value;
    }

    public get type(): IBranchType {
        return <IBranchType>String(this.branchObject.type);
    }

    public set type(value: IBranchType) {
        this.branchObject.type = value;
    }

    public get name(): string {
        return String(this.branchObject.name) || "";
    }

    public set name(value: string) {
        this.branchObject.name = value;
    }

    public get parentid(): number {
        return Number(this.branchObject.parentid) || 0;
    }

    public set parentid(value: number) {
        this.branchObject.parentid = value;
    }

    public get sequence(): number {
        return Number(this.branchObject.sequence) || 0;
    }

    public set sequence(value: number) {
        this.branchObject.sequence = value;
    }

    public get custom(): any {
        return this._branchObject.custom;
    }

    public set custom(value: any) {
        this._branchObject.custom = value;
    }

    public getCustom(key: string): any {
        if (key in this.custom) {
            return this.custom[key];
        } else {
            return null;
        }
    }

    public setCustom(key: string, value: any): void {
        this._branchObject.custom[key] = value;
    }

    public get checked(): boolean {
        return this.getCustom("checked") || false;
    }

    public set checked(value: boolean) {
        this.setCustom("checked", value);
    }

    public get disabled(): boolean {
        return this.getCustom("disabled") || false;
    }

    public set disabled(value: boolean) {
        this.setCustom("disabled", value);
    }

    public get status(): number {
        return this.getCustom("status") || 0;
    }

    public set status(value: number) {
        this.setCustom("status", value);
    }

    public get percent(): number {
        let shot: number = 0;
        let done: number = 0;
        //let fail: number = 0;
        if (this.type === STR.section) {
            this.activeKeys.forEach((key: number)=>{
                if (key >= -7 && key <= 7) {
                    shot += this.shot[0][key+7];
                    shot += this.shot[1][key+7];
                    done += this.done[0][key+7];
                    done += this.done[1][key+7];
                    //fail += (shot-done);
                }
            });
            return ((done/shot)* 100) || 0;
        } else {
            let percent: number = 0;
            this.children.forEach((branch: BranchClass)=>{
                percent += branch.percent;
            });
            return (percent / (this.children.length * 100) * 100) || 0;
        }
    }

    public get mainKey(): number {
        if (this.type === STR.sheet) {
            return this.getCustom("mainKey") || null;
        } else if (this.type === STR.section && this.parent.type === STR.sheet) {
            return this.parent.mainKey;
        } else {
            return null;
        }
    }

    public set mainKey(value: number) {
        if (this.type === STR.sheet) {
            this.setCustom("mainKey", value);
        }
    }

    public get activeKeys(): IVariableCOFNumberArray {
         if (this.type === STR.sheet) {
            return this.getCustom("activeKeys") || [];
        } else if (this.type === STR.section && this.parent.type === STR.sheet) {
            return this.parent.activeKeys;
        } else {
            return [];
        }
    }

    public set activeKeys(value: IVariableCOFNumberArray) {
        this.setCustom("activeKeys", value);
    }

    public get shot(): [IFixedCOFNumberArray,IFixedCOFNumberArray] {
        if (this.type === STR.section) {
            return this.getCustom("shot") || [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        } else {
            return null;
        }
    }

    public set shot(value: [IFixedCOFNumberArray,IFixedCOFNumberArray]) {
        if (this.type === STR.section) {
            this.setCustom("shot", value);
        }
    }

    public get done(): [IFixedCOFNumberArray,IFixedCOFNumberArray] {
        if (this.type === STR.section) {
            return this.getCustom("done") || [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        } else {
            return null;
        }
    }

    public set done(value: [IFixedCOFNumberArray,IFixedCOFNumberArray]) {
        if (this.type === STR.section) {
            this.setCustom("done", value);
        }
    }

    public get data(): Buffer {
        return null;
    }
}

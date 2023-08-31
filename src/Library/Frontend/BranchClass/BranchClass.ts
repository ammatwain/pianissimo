import { STR } from "@Global/STR";
import { IFixedCOFNumberArray } from "@Interfaces/IFixedCOFNumberArray";
import { IVariableCOFNumberArray } from "@Interfaces/IVariableCOFNumberArray";
import { IBranchObject } from "@Interfaces/IBranchObject";
import { IBranchType } from "@Interfaces/IBranchType";
import { IBranchCustom } from "@Interfaces/IBranchCustom";

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
        this.Parent =  parent;
        this._branchObject = branch;
        this._branchCustomFreezed = JSON.stringify(this._branchObject.custom);
        // in questo momento custom potrebbe essere una stringa;
        if (typeof this._branchObject.custom === STR.string) {
            this._branchObject.custom = JSON.parse(this._branchObject.custom) ||  {};
        }
        /*
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
        */

    }

    public get ActiveKeys(): IVariableCOFNumberArray {
        if (this.Type === STR.sheet) {
            return this.getCustom(STR.activeKeys, [this.MainKey]);
        } else if (this.Type === STR.section && this.Parent.Type === STR.sheet) {
            return this.Parent.ActiveKeys;
        } else {
            return [];
        }
    }

    public set ActiveKeys(value: IVariableCOFNumberArray) {
        if (this.Type === STR.sheet) {
            this.setCustom(STR.activeKeys, value);
        }
    }

    public get BranchObject(): IBranchObject {
        return this._branchObject || null;
    }

    private set BranchObject(value: IBranchObject) {
        this._branchObject = value || null;
    }

    public get Checked(): boolean {
        return this.getCustom(STR.checked, false);
    }

    public set Checked(value: boolean) {
        this.setCustom(STR.checked, value);
    }

    public get Children(): BranchClass[] {
        return this._children || [];
    }

    public set Children(value: BranchClass[]) {
        this._children = value || [];
    }

    public get Custom(): any {
        return this._branchObject.custom;
    }

    public set Custom(value: any) {
        this._branchObject.custom = value;
    }

    public get Data(): Buffer {
        return null;
    }

    public get Disabled(): boolean {
        return this.getCustom(STR.disabled, false);
    }

    public set Disabled(value: boolean) {
        this.setCustom(STR.disabled, value);
    }

    public get Done(): [IFixedCOFNumberArray,IFixedCOFNumberArray] {
        if (this.Type === STR.section) {
            return this.getCustom(STR.done, [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]);
        } else {
            return null;
        }
    }

    public set Done(value: [IFixedCOFNumberArray,IFixedCOFNumberArray]) {
        if (this.Type === STR.section) {
            this.setCustom(STR.done, value);
        }
    }

    public get HtmlLiElement(): HTMLLIElement {
        return this._HTMLLiElement;
    }

    public set HtmlLiElement(value: HTMLLIElement) {
        this._HTMLLiElement = value;
    }

    public get Id(): number {
        return Number(this.BranchObject.id) || 0;
    }

    public set Id(value: number) {
        this.BranchObject.id = value;
    }

    public get IsFragment(): boolean {
        return (!(
            this.Type === STR.section &&
            this.MeasureStart === 0 &&
            this.MeasureEnd === (this.Measures-1)
        ));
    }

    public get Level(): number {
        if (this.Parent){
            return this.Parent.Level + 1;
        } else {
            return 0;
        }
    }

    public get MainKey(): number {
        if (this.Type === STR.sheet) {
            return (this.getCustom(STR.mainKey, 0));
        } else if (this.Type === STR.section && this.Parent.Type === STR.sheet) {
            return this.Parent.MainKey;
        } else {
            return null;
        }
    }

    public set MainKey(value: number) {
        if (this.Type === STR.sheet) {
            this.setCustom(STR.mainKey, value);
        }
    }

    public get Measures(): number {
        if (this.Type === STR.sheet ) {
            return <number>this.getCustom(STR.sheet, 0);
        } else if ((this.Type === STR.sheet) && (this.Parent.Type === STR.sheet)) {
            return <number>this.Parent.Measures;
        } else {
            return 0;
        }
    }

    public get MeasureEnd(): number {
        if (this.Type === STR.sheet ) {
            return this.Measures-1;
        } else if ((this.Type === STR.section) && (this.Parent.Type === STR.sheet)) {
            return <number>this.getCustom(STR.measureEnd, this.Parent.MeasureEnd);
        } else {
            return 0;
        }
    }

    public get MeasureStart(): number {
        if ((this.Type === STR.section) && (this.Parent.Type === STR.sheet)) {
            return <number>this.getCustom(STR.measureEnd, 0);
        } else {
            return 0;
        }
    }

    private get Modified(): boolean {
        this._customIsModified = this._customIsModified || (this._branchCustomFreezed !== JSON.stringify(this._branchObject));
        return this._customIsModified;
    }

    public get Name(): string {
        return String(this.BranchObject.name) || "";
    }

    public set Name(value: string) {
        this.BranchObject.name = value;
    }

    public get Parent(): BranchClass {
        return this._parent || null;
    }

    public set Parent(value: BranchClass) {
        this._parent = value || null;
    }

    public get ParentId(): number {
        return Number(this.BranchObject.parentid) || 0;
    }

    public set ParentId(value: number) {
        this.BranchObject.parentid = value;
    }

    public get Percent(): number {
        let shot: number = 0;
        let done: number = 0;
        //let fail: number = 0;
        if (this.Type === STR.section) {
            this.ActiveKeys.forEach((key: number)=>{
                if (key >= -7 && key <= 7) {
                    shot += this.Shot[0][key+7];
                    shot += this.Shot[1][key+7];
                    done += this.Done[0][key+7];
                    done += this.Done[1][key+7];
                    //fail += (shot-done);
                }
            });
            return ((done/shot)* 100) || 0;
        } else {
            let percent: number = 0;
            this.Children.forEach((branch: BranchClass)=>{
                percent += branch.Percent;
            });
            return (percent / (this.Children.length * 100) * 100) || 0;
        }
    }

    public get Root(): BranchClass {
        if(this.Parent!== null || this.ParentId===0) {
            return this;
        } else {
            return this.Parent.Root;
        }
    }

    public get Sequence(): number {
        return Number(this.BranchObject.sequence) || 0;
    }

    public set Sequence(value: number) {
        this.BranchObject.sequence = value;
    }

    public get Type(): IBranchType {
        return <IBranchType>String(this.BranchObject.type);
    }

    public set Type(value: IBranchType) {
        this.BranchObject.type = value;
    }

    public get Shot(): [IFixedCOFNumberArray,IFixedCOFNumberArray] {
        if (this.Type === STR.section) {
            return this.getCustom(STR.shot, [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]);
        } else {
            return null;
        }
    }

    public set Shot(value: [IFixedCOFNumberArray,IFixedCOFNumberArray]) {
        if (this.Type === STR.section) {
            this.setCustom(STR.shot, value);
        }
    }

    public get Status(): number {
        return this.getCustom(STR.status, 0);
    }

    public set Status(value: number) {
        this.setCustom(STR.status, value);
    }

    public getCustom(key: string, defaultValue: any = null): any {
        if (!(key in this.Custom)) {
            this.Custom[key] = defaultValue;
        }
        return this.Custom[key];
    }

    public setCustom(key: string, value: any): void {
        this._branchObject.custom[key] = value;
    }
    public closest(type: IBranchType): BranchClass {
        if(this.Type===type) {
            return this;
        } else if (this.Parent) {
            return this.Parent.closest(type);
        } else {
            return null;
        }
    }

    public child(type: IBranchType): BranchClass {
        let child: BranchClass = null;
        if(this.Type === type) {
            child = this;
        } else if (this.Children.length) {
            for(let i: number = 0 ; i < this.Children.length; i++) {
                if (this.Children[i].Type===type) {
                    child = this.Children[i];
                    break;
                } else {
                    child = this.Children[i].child(type);
                }
            }
        }
        return child;
    }

    public saveCustom(): IBranchObject {
        if (this.Modified) {
            window.electron.ipcRenderer.invoke(STR.requestSaveBranchCustom, this.Id, this.BranchObject.custom ).then((result: IBranchCustom)=>{
                this.BranchObject.custom = result;
                console.log(result);
            });
        }
        return this.BranchObject;
    }

}

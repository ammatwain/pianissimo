import { IVariableCOFNumberArray, IFixedCOFNumberArray, IBranchObject, IBranchType } from "../../Common";

export class BranchClass{
    private _parent: BranchClass;
    private _children: BranchClass[];
    private _branchObject: IBranchObject;

    rnd(max: number): number  {
        return Math.floor(Math.random() * max);
    }

    constructor(branch: IBranchObject, parent: BranchClass = null) {
        this.parent =  parent;
        this._branchObject = branch;

        // in questo momento custom dovrebbe essere una stringa;
        if (typeof this._branchObject.custom === "string") {
            this._branchObject.custom = JSON.parse(this._branchObject.custom) ||  {};
        }
       if (this.type==="section"){
            this.activeKeys=[-2, +1, +5];
            let r: number = this.rnd(10);
            if (r<5) {
                r = r +1;
                for (let i: number = 0 ; i<r ; i++) {
                    const n: number = this.rnd (15) -7;
                    if (!this.activeKeys.includes(n)) {
                        this.activeKeys.push(n);
                    }
                }
            }
            this.shot = [
                this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
                this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
                this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10, this.rnd(10)+10,
            ];
            this.done = [
                this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
                this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
                this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10), this.rnd(10),
            ];
        }
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
        if (this.type === "section") {
            this.activeKeys.forEach((key: number)=>{
                if (key >= -7 && key <= 7) {
                    shot += this.shot[key+7];
                    done += this.done[key+7];
                    //fail += (shot-done);
                }
            });
        } else {
            let percent: number = 0;
            this.children.forEach((branch: BranchClass)=>{
                percent += branch.percent;
            });
            return percent / (this.children.length * 100) * 100;
        }

        return (done/shot)* 100;
    }

    public set percent(value: number) {
        ;
    }

    public get mainKey(): number {
        return this.getCustom("mainKey") || false;
    }

    public set mainKey(value: number) {
        this.setCustom("mainKey", value);
    }

    public get activeKeys(): IVariableCOFNumberArray {
        return this.getCustom("activeKeys") || [];
    }

    public set activeKeys(value: IVariableCOFNumberArray) {
        this.setCustom("activeKeys", value);
    }

    public get shot(): IFixedCOFNumberArray {
        return this.getCustom("shot") || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    public set shot(value: IFixedCOFNumberArray) {
        this.setCustom("shot", value);
    }

    public get done(): IFixedCOFNumberArray {
        return this.getCustom("done") || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    public set done(value: IFixedCOFNumberArray) {
        this.setCustom("done", value);
    }

    public get data(): Buffer {
        return null;
    }
}

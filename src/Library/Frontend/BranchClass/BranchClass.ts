import { IVariableCOFNumberArray, IFixedCOFNumberArray, IBranchObject } from "..";

export class BranchClass{
    private _parent: BranchClass;
    private _children: BranchClass[];
    private _branchObject: IBranchObject;

    constructor(branch: IBranchObject, parent: BranchClass = null) {
        this.parent =  parent;
        this._branchObject = branch;
        // in questo momento custom dovrebbe essere una stringa;
        if (typeof this._branchObject.custom === "string") {
            this._branchObject.custom= JSON.parse(this._branchObject.custom);
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

    public get checked(): boolean {
        return Boolean(this.branchObject.custom && this.branchObject.custom.checked) || false;
    }

    public set checked(value: boolean) {
        this.branchObject.custom.checked = value;
    }

    public get disabled(): boolean {
        return Boolean(this.branchObject.custom && this.branchObject.custom.disabled) || false;
    }

    public set disabled(value: boolean) {
        this.branchObject.custom.disabled = value;
    }

    public get status(): number {
        return Number(this.branchObject.custom && this.branchObject.custom.status) || 0;
    }

    public set status(value: number) {
        this.branchObject.custom.status = value;
    }

    public get percent(): number {
        return 0;
    }

    public set percent(value: number) {
        //;
    }

    public get mainKey(): number {
        return Number(this.branchObject.custom.mainKey) || null;
    }

    public set mainKey(value: number) {
        this.branchObject.custom.mainKey = value;
    }

    public get activeKeys(): IVariableCOFNumberArray {
        return this.branchObject.custom.activeKeys || [];
    }

    public set activeKeys(value: IVariableCOFNumberArray) {
        this.branchObject.custom.activeKeys = value;
    }

    public get shot(): IFixedCOFNumberArray {
        return this.branchObject.custom.shot || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    public set shot(value: IFixedCOFNumberArray) {
        this.branchObject.custom.shot = value;
    }

    public get data(): Buffer {
        return null;
    }
}

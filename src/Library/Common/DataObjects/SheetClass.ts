import { TSheetObject } from "./TSheetObject";
import { LibraryClass } from "./LibraryClass";
import { TMajorKey, TVariableMajorKeyNumberArray, TFixedNumberArray } from "./TFieldTypes";

class TActiveKeys extends Set<number> {

    protected jsonString: string =  "[]";

    addKey(key: number): TActiveKeys {
        if (this.isValidKey(key)) {
            super.add(key);
        }
        return this;
    }

    delKey(key: number): TActiveKeys {
        super.delete(key);
        return this;
    }

    hasKey(key: number): boolean {
        if (this.isValidKey(key)) {
            return super.has(key);
        }
        return false;
    }


    isValidKey(key: number): boolean {
        return (key >= -7 && key <= 7 && ((key - Math.floor(key)) === 0));
    }

    isNotValidKey(key: number): boolean {
        return !this.isValidKey(key);
    }

    isValid(): boolean {
        let ok: boolean = this.size <= 15;
        if (ok) {
            this.forEach((key: number)=>{
                if (this.isNotValidKey(key)) {
                    ok = false;
                }
            });
        }
        return ok;
    }

    toJsonString(): string {
        this.uSort();
        return JSON.stringify(Array.from(this));
    }

    uSort(): TActiveKeys {
        const sortedArray: number[] = [...this].sort();
        this.clear();
        sortedArray.forEach((key: number) => {
            if(this.isValidKey(key)){
                this.addKey(key);
            }
        });
        return this;
    }

    static fromJsonString(keys: string): TActiveKeys {
        const tak: TActiveKeys = new TActiveKeys(JSON.parse(keys));
        tak.uSort();
        tak.jsonString = JSON.stringify(tak);
        return tak;
    }

}

export class SheetClass extends LibraryClass {
/*
    protected fields: TSheetObject = {
        sheetId: undefined,
        parentScoreId: undefined,
        sequence: undefined,
        status: undefined,
        title: undefined,
        subtitle: undefined,
        activeKey: undefined,
        activeKeys: undefined,
        measureStart: undefined,
        measureEnd: undefined,
        selectedParts: undefined,
        selectedStaves: undefined,
        transposeBy: undefined,
        shot: undefined,
        done: undefined,
        loop: undefined,
    };
*/

    declare protected fields: TSheetObject;
    private activeKeys: TActiveKeys;
    private shot: TFixedNumberArray;
    private done: TFixedNumberArray;
    private loop: TFixedNumberArray;

    public set Fields(fields: TSheetObject) {
        this.fields = fields;
        this.activeKeys = TActiveKeys.fromJsonString(this.SheetFields.activeKeys);
        this.shot = <TFixedNumberArray>JSON.parse(this.SheetFields.shot);
        this.done = <TFixedNumberArray>JSON.parse(this.SheetFields.done);
        this.loop = <TFixedNumberArray>JSON.parse(this.SheetFields.loop);
    }

    public get SheetFields(): TSheetObject {
        return <TSheetObject>this.fields;
    }

    private set SheetFields(sheetFields: TSheetObject) {
        this.fields = sheetFields;
    }

    public get Id(): number {
        return this.SheetId;
    }

    public get ParentId(): number {
        return this.ParentScoreId;
    }

    protected set ParentId(parentId: number) {
        this.ParentScoreId = parentId;
    }

    public get SheetId(): number {
        return this.SheetFields.sheetId;
    }

    public set SheetId(sheetId: number) {
        if (this.SheetFields.sheetId !== sheetId) {
            this.SheetFields.sheetId = sheetId;
            this.FieldsChanged = true;
        }
    }

    public get ParentScoreId(): number {
        return this.SheetFields.parentScoreId;
    }

    public set ParentScoreId(parentScoreId: number) {
        if (this.SheetFields.parentScoreId !== parentScoreId) {
            this.SheetFields.parentScoreId = parentScoreId;
            this.FieldsChanged = true;
        }
    }

    public get Sequence(): number {
        return this.SheetFields.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.SheetFields.sequence !== sequence) {
            this.SheetFields.sequence = sequence;
            this.FieldsChanged = true;
        }
    }

    public get Status(): string {
        return this.SheetFields.status;
    }

    public set Status(status: string) {
        if (this.SheetFields.status !== status) {
            this.SheetFields.status = status;
            this.FieldsChanged = true;
        }
    }

    public get Title(): string {
        return this.SheetFields.title;
    }

    public set Title(title: string) {
        if (this.SheetFields.title !== title) {
            this.SheetFields.title = title;
            this.FieldsChanged = true;
        }
    }

    public get Subtitle(): string {
        return this.SheetFields.subtitle;
    }

    public set Subtitle(subtitle: string) {
        if (this.SheetFields.subtitle !== subtitle) {
            this.SheetFields.subtitle = subtitle;
            this.FieldsChanged = true;
        }
    }

    public get ActiveKey(): TMajorKey {
        return this.SheetFields.activeKey;
    }

    public set ActiveKey(activeKey: TMajorKey) {
        if (
            this.SheetFields.activeKey !== activeKey &&
            activeKey >= -7 &&
            activeKey <= 7
        ) {
            this.SheetFields.activeKey = <TMajorKey>Math.floor(activeKey);
            this.FieldsChanged = true;
        }
    }

    public get ActiveKeys(): TVariableMajorKeyNumberArray {
        return this.activeKeys;
    }

    private set ActiveKeys(activeKeys: TVariableMajorKeyNumberArray) {
        this.activeKeys = activeKeys;
        const tmpActiveKeys: string = JSON.stringify(activeKeys);
        if (this.SheetFields.activeKeys !== tmpActiveKeys) {
            this.SheetFields.activeKeys = tmpActiveKeys;
            this.FieldsChanged = true;
        }
    }

    public addToActiveKeys(activeKey: TMajorKey): void {
        activeKey = <TMajorKey>Math.floor(activeKey);
        if (
            activeKey >= -7 &&
            activeKey <= 7 &&
            !this.keyInActiveKeys(activeKey)
        ) {
            const tmpActiveKeys: TVariableMajorKeyNumberArray = [];
            this.activeKeys.push(activeKey);
            this.activeKeys.sort().forEach((key: TMajorKey)=>{
                tmpActiveKeys.push(key);
            });
            this.ActiveKeys = tmpActiveKeys;

        }
    }

    public keyInActiveKeys(activeKey: TMajorKey): boolean {
        return this.activeKeys.includes(activeKey);
    }

    public removeFromActiveKeys(activeKey: TMajorKey): void {
        activeKey = <TMajorKey>Math.floor(activeKey);
        if (
            this.keyInActiveKeys(activeKey)
        ) {
            const tmpActiveKeys: TVariableMajorKeyNumberArray = [];
            delete this.activeKeys[this.activeKeys.indexOf(activeKey)];
            this.activeKeys.sort().forEach((key: TMajorKey)=>{
                tmpActiveKeys.push(key);
            });
            this.ActiveKeys = tmpActiveKeys;
        }
    }

}


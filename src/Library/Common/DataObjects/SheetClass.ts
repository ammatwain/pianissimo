import { TSheetObject } from "./TSheetObject";
import { LibraryClass } from "./LibraryClass";

class TPracticeKeys extends Set<number> {

    protected jsonString: string =  "[]";

    addKey(key: number): TPracticeKeys {
        if (this.isValidKey(key)) {
            super.add(key);
        }
        return this;
    }

    delKey(key: number): TPracticeKeys {
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

    uSort(): TPracticeKeys {
        const sortedArray: number[] = [...this].sort();
        this.clear();
        sortedArray.forEach((key: number) => {
            if(this.isValidKey(key)){
                this.addKey(key);
            }
        });
        return this;
    }

    static fromJsonString(keys: string): TPracticeKeys {
        const tak: TPracticeKeys = new TPracticeKeys(JSON.parse(keys));
        tak.uSort();
        tak.jsonString = JSON.stringify(tak);
        return tak;
    }

}

class TFifteenKeys extends Map<number, number> {

    constructor(){
        super();
        for(let i: number = -7; i<=7; i++) {
            this.setKey(i,0);
        }
    }

    setKey(key: number, value: number): TFifteenKeys {
        if (this.isValidKey(key)){
            this.set(key,value);
        }
        return this;
    }

    getKey(key: number): number {
        if (this.isValidKey(key)){
            return Number(this.get(key)) || 0;
        }
        return NaN;
    }

    isValidKey(key: number): boolean {
        return (key >= -7 && key <= 7 && ((key - Math.floor(key)) === 0));
    }

    isNotValidKey(key: number): boolean {
        return !this.isValidKey(key);
    }

    toJsonString(): string {
        const array: number[] = [];
        for(let key: number = -7; key<=7; key++) {
            if (this.has(key)) {
                array.push(this.getKey(key));
            } else {
                // sanitize
                this.setKey(key,0);
                array.push(0);
            }
        }
        return JSON.stringify(array);
    }

    static fromJsonString(values: string): TFifteenKeys {
        const mak: TFifteenKeys = new TFifteenKeys();
        const array: number[] = <number[]>JSON.parse(values);
        if (array.length===15){
            for(let i: number = -7; i<=7; i++) {
                mak.setKey(i,array[i+7]);
            }
        }
        return mak;
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
        practiceKeys: undefined,
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
    private practiceKeys: TPracticeKeys;
    private shot: TFifteenKeys;
    private done: TFifteenKeys;
    private loop: TFifteenKeys;

    public set Fields(fields: TSheetObject) {
        this.fields = fields;
        this.practiceKeys = TPracticeKeys.fromJsonString(this.SheetFields.practiceKeys);
        this.shot = TFifteenKeys.fromJsonString(this.SheetFields.shot);
        this.done = TFifteenKeys.fromJsonString(this.SheetFields.done);
        this.loop = TFifteenKeys.fromJsonString(this.SheetFields.loop);
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
            if (this.updateField("parentScoreId",parentScoreId)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Sequence(): number {
        return this.SheetFields.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.SheetFields.sequence !== sequence) {
            this.SheetFields.sequence = sequence;
            this.FieldsChanged = true;
            if (this.updateField("sequence",sequence)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
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

    public get ActiveKey(): number {
        return this.SheetFields.activeKey;
    }

    public set ActiveKey(activeKey: number) {
        if (
            this.SheetFields.activeKey !== activeKey &&
            activeKey >= -7 &&
            activeKey <= 7
        ) {
            this.SheetFields.activeKey = Math.floor(activeKey);
            this.FieldsChanged = true;
        }
    }

    public get PracticeKeys(): TPracticeKeys {
        return this.practiceKeys;
    }

    public practiceKeysAdd(key: number): boolean {
        const tmpActiveKeysString: string = this.PracticeKeys.addKey(key).toJsonString();
        if (this.fields.practiceKeys !== tmpActiveKeysString ) {
            this.fields.practiceKeys = tmpActiveKeysString;
            this.FieldsChanged = true;
            return this.FieldsChanged;
        }
        return false;
    }

    public practiceKeysDel(key: number): boolean {
        const tmpActiveKeysString: string = this.PracticeKeys.delKey(key).toJsonString();
        if (this.fields.practiceKeys !== tmpActiveKeysString ) {
            this.fields.practiceKeys = tmpActiveKeysString;
            this.FieldsChanged = true;
            return this.FieldsChanged;
        }
        return false;
    }

    public get Shot(): TFifteenKeys {
        return this.shot;
    }

    public shotSet(key: number, value: number): boolean {
        const tmpShotString: string = this.Shot.setKey(key, value).toJsonString();
        if (this.fields.shot !== tmpShotString ) {
            this.fields.shot = tmpShotString;
            this.FieldsChanged = true;
            return this.FieldsChanged;
        }
        return false;
    }

    public get Done(): TFifteenKeys {
        return this.done;
    }

    public doneSet(key: number, value: number): boolean {
        const tmpDoneString: string = this.Done.setKey(key, value).toJsonString();
        if (this.fields.done !== tmpDoneString ) {
            this.fields.done = tmpDoneString;
            this.FieldsChanged = true;
            return this.FieldsChanged;
        }
        return false;
    }

    public get Loop(): TFifteenKeys {
        return this.loop;
    }

    public loopSet(key: number, value: number): boolean {
        const tmpLoopString: string = this.Loop.setKey(key, value).toJsonString();
        if (this.fields.loop !== tmpLoopString ) {
            this.fields.loop = tmpLoopString;
            this.FieldsChanged = true;
            return this.FieldsChanged;
        }
        return false;
    }
    protected updateField(field: string, value: number | string): boolean {
        return this.$updateField({
            table:"sheets",
            pkey:"sheetId",
            id:this.SheetId,
            field: field,
            value: value,
        });
    }

}


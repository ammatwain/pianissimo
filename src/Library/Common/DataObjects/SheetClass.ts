import { TSheetObject } from "./TSheetObject";
import { LibraryClass } from "./LibraryClass";
import { TLibrary } from "@Library/Frontend";

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

    public setFromJsonString(keys: string): TPracticeKeys {
        const array: number[] = <number[]>JSON.parse(keys);
        array.forEach((k: number) => {
            this.addKey(k);
        });
        return this;
    }

    public get Values(): number[] {
        const values: number[] = Array.from(this);
        Array.from(this).forEach((n: number)=>{
            values.push(n);
        });
        return values;
    }

    public set Values(values: number[]) {
        values.forEach((value: number)=>{
            this.addKey(value);
        });
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

    public get Values(): number[] {
        const values: number[] = [];
        for(let i: number = -7; i<=7 ; i++){
            values.push(this.get(i));
        }
        return values;
    }

    public set Values(values: number[]) {
        if (values.length===15){
            for(let i: number = -7; i<=7 ; i++){
                this.setKey(i,values[i+7]);
            }
        }
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

    constructor(fields: TSheetObject, library: TLibrary){
        super(fields, library);
        this.practiceKeys = new TPracticeKeys();
        this.shot = new TFifteenKeys();
        this.done = new TFifteenKeys();
        this.loop = new TFifteenKeys();
        this.practiceKeys.Values = this.SheetObject.practiceKeys;
        this.shot.Values = this.SheetObject.shot;
        this.done.Values = this.SheetObject.done;
        this.loop.Values = this.SheetObject.loop;
    }

    public get SheetObject(): TSheetObject {
        return <TSheetObject>this.fields;
    }

    private set SheetObject(sheetObject: TSheetObject) {
        this.fields = sheetObject;
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
        return this.SheetObject.sheetId;
    }

    public set SheetId(sheetId: number) {
        if (this.SheetObject.sheetId !== sheetId) {
            this.SheetObject.sheetId = sheetId;
            this.FieldsChanged = true;
        }
    }

    public get ParentScoreId(): number {
        return this.SheetObject.parentScoreId;
    }

    public set ParentScoreId(parentScoreId: number) {
        if (this.SheetObject.parentScoreId !== parentScoreId) {
            this.SheetObject.parentScoreId = parentScoreId;
            this.FieldsChanged = true;
            if (this.updateField("parentScoreId",parentScoreId)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Sequence(): number {
        return this.SheetObject.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.SheetObject.sequence !== sequence) {
            this.SheetObject.sequence = sequence;
            this.FieldsChanged = true;
            if (this.updateField("sequence",sequence)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Status(): string {
        return this.SheetObject.status;
    }

    public set Status(status: string) {
        if (this.SheetObject.status !== status) {
            this.SheetObject.status = status;
            this.FieldsChanged = true;
        }
    }

    public get Title(): string {
        return this.SheetObject.title;
    }

    public set Title(title: string) {
        if (this.SheetObject.title !== title) {
            this.SheetObject.title = title;
            this.FieldsChanged = true;
        }
    }

    public get Subtitle(): string {
        return this.SheetObject.subtitle;
    }

    public set Subtitle(subtitle: string) {
        if (this.SheetObject.subtitle !== subtitle) {
            this.SheetObject.subtitle = subtitle;
            this.FieldsChanged = true;
        }
    }

    public get ActiveKey(): number {
        return this.SheetObject.activeKey;
    }

    public set ActiveKey(activeKey: number) {
        if (
            this.SheetObject.activeKey !== activeKey &&
            activeKey >= -7 &&
            activeKey <= 7
        ) {
            this.SheetObject.activeKey = Math.floor(activeKey);
            this.FieldsChanged = true;
        }
    }

    public get PracticeKeys(): number[] {
        console.log(this.practiceKeys);
        return this.practiceKeys.Values;
    }

    public set PracticeKeys(practiceKeys: number[]) {
        const oldPracticeKeysString: string = this.practiceKeys.toJsonString();
        this.practiceKeys.Values = practiceKeys;
        const newPracticeKeysString: string = this.practiceKeys.toJsonString();
        if(oldPracticeKeysString !== newPracticeKeysString){
            if (this.updateField("practiceKeys",newPracticeKeysString)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public practiceKeysAdd(key: number): boolean {
        const oldPracticeKeysString: string = this.practiceKeys.toJsonString();
        const newPracticeKeysString: string = this.practiceKeys.addKey(key).toJsonString();
        const changed: boolean = oldPracticeKeysString !== newPracticeKeysString;
        if(changed){
            if (this.updateField("practiceKeys",newPracticeKeysString)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
        return changed;
    }

    public practiceKeysDel(key: number): boolean {
        const oldPracticeKeysString: string = this.practiceKeys.toJsonString();
        const newPracticeKeysString: string = this.practiceKeys.delKey(key).toJsonString();
        const changed: boolean = oldPracticeKeysString !== newPracticeKeysString;
        if(changed){
            if (this.updateField("practiceKeys",newPracticeKeysString)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
        return changed;
    }

    public practiceKeysExists(key: number): boolean {
        return this.practiceKeys.hasKey(key);
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
        return this.$updateDb({
            table:"sheets",
            pkey:"sheetId",
            id:this.SheetId,
            field: field,
            value: value,
        }) !== null;
    }

}


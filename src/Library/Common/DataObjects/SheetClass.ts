import { THiddenPart, TSheetObject } from "./TSheetObject";
import { LibraryClass } from "./LibraryClass";
import { TLibrary } from "@Library/Frontend";

class TPracticeKeys extends Set<number> {

    protected jsonString: string =  "[]";

    addKey(key: number): TPracticeKeys {
        key = Number(key);
        if (
            this.isValidKey(key) &&
            !this.hasKey(key)
        ) {
            super.add(key);
        }
        return this;
    }

    delKey(key: number): TPracticeKeys {
        key = Number(key);
        super.delete(key);
        return this;
    }

    hasKey(key: number): boolean {
        key = Number(key);
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
        const values: number[] = [];
        Array.from(this).forEach((n: number)=>{
            values.push(Number(n));
        });
        return values;
    }

    public set Values(values: number[]) {
        values.forEach((value: number)=>{
            this.addKey(Number(value));
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

    public get ActiveKey(): number {
        return this.SheetObject.activeKey;
    }

    public set ActiveKey(activeKey: number) {
        activeKey = Math.floor(activeKey);
        if (
            this.SheetObject.activeKey !== activeKey &&
            activeKey >= -7 &&
            activeKey <= 7
        ) {
            this.updateField("activeKey",activeKey);
        }
    }

    public get HiddenParts(): THiddenPart {
        return this.SheetObject.hiddenParts;
    }

    public set HiddenParts(hiddenParts: THiddenPart) {
        const oldHiddenPartsString: string = JSON.stringify(this.HiddenParts);
        const newHiddenPartsString: string = JSON.stringify(hiddenParts);
        if(oldHiddenPartsString !== newHiddenPartsString){
            this.updateField("hiddenParts",hiddenParts);
        }
    }

    public get Id(): number {
        return this.SheetId;
    }

    public get MeasureEnd(): number {
        return this.SheetObject.measureEnd;
    }

    public set MeasureEnd(measureEnd: number) {
        if (this.SheetObject.measureEnd !== measureEnd) {
            this.updateField("measureEnd",measureEnd);
        }
    }

    public get MeasureStart(): number {
        return this.SheetObject.measureStart;
    }

    public set MeasureStart(measureStart: number) {
        if (this.SheetObject.measureStart !== measureStart) {
            this.updateField("measureStart",measureStart);
        }
    }

    public get ParentId(): number {
        return this.ParentScoreId;
    }

    protected set ParentId(parentId: number) {
        this.ParentScoreId = parentId;
    }

    public get ParentScoreId(): number {
        return this.SheetObject.parentScoreId;
    }

    public set ParentScoreId(parentScoreId: number) {
        if (this.SheetObject.parentScoreId !== parentScoreId) {
            this.SheetObject.parentScoreId = parentScoreId;
            this.updateField("parentScoreId",parentScoreId);
        }
    }

    public get PracticeKeys(): number[] {
        return this.SheetObject.practiceKeys;
    }

    public set PracticeKeys(practiceKeys: number[]) {
        const oldPracticeKeysString: string = JSON.stringify(this.PracticeKeys);
        const newPracticeKeysString: string = JSON.stringify(practiceKeys.sort((a: number, b: number) => {return a - b;}));
        if(oldPracticeKeysString !== newPracticeKeysString){
            this.updateField("practiceKeys",JSON.parse(newPracticeKeysString));
        }
    }

    public get Sequence(): number {
        return this.SheetObject.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.SheetObject.sequence !== sequence) {
            this.updateField("sequence",sequence);
        }
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

    public get SheetObject(): TSheetObject {
        return <TSheetObject>this.fields;
    }

    private set SheetObject(sheetObject: TSheetObject) {
        this.fields = sheetObject;
    }

    public get Status(): string[] {
        return this.SheetObject.status;
    }

    public set Status(status: string[]) {
        const oldStatusString: string = JSON.stringify(this.SheetObject.status);
        const newStatusString: string = JSON.stringify(status);
        if (oldStatusString !== newStatusString) {
            this.updateField("status",status);
        }
    }

    public get Subtitle(): string {
        return this.SheetObject.subtitle;
    }

    public set Subtitle(subtitle: string) {
        if (this.SheetObject.subtitle !== subtitle) {
            this.updateField("subtitle",subtitle);
        }
    }

    public get Title(): string {
        return this.SheetObject.title;
    }

    public set Title(title: string) {
        if (this.SheetObject.title !== title) {
            this.updateField("title",title);
        }
    }

    public get Shot(): number[] {
        if (!(
            Array.isArray(this.SheetObject.shot) &&
            this.SheetObject.shot.length===15
        )) {
            this.SheetObject.shot = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
        return this.SheetObject.shot;
    }

    public set Shot(status: number[]) {
        const oldStatusString: string = JSON.stringify(this.SheetObject.status);
        const newStatusString: string = JSON.stringify(status);
        if (oldStatusString !== newStatusString) {
            this.updateField("status",status);
        }
    }

    public shotAdd(key: number, value: number): boolean {
        key = Math.floor(key);
        if (
            key >= -7 &&
            key <= 7 &&
            value > 0
        ) {
            this.Shot[key + 7] += value;
            return this.updateField("shot",this.Shot);
        }
        return false;
    }

    public shotSet(key: number, value: number): boolean {
        key = Math.floor(key);
        if (
            key >= -7 &&
            key <= 7 &&
            this.Shot[key + 7] !== value
        ) {
            this.Shot[key + 7] = value;
            return this.updateField("shot",this.Shot);
        }
        return false;
    }

    public get Done(): number[] {
        if (!(
            Array.isArray(this.SheetObject.done) &&
            this.SheetObject.done.length===15
        )) {
            this.SheetObject.done = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
        return this.SheetObject.done;
    }


    public doneAdd(key: number, value: number): boolean {
        key = Math.floor(key);
        if (
            key >= -7 &&
            key <= 7 &&
            value > 0
        ) {
            this.Done[key +7] += value;
            return this.updateField("done",this.Done);
        }
        return false;
    }

    public doneSet(key: number, value: number): boolean {
        key = Math.floor(key);
        if (
            key >= -7 &&
            key <= 7 &&
            this.Done[key +7] !== value
        ) {
            this.Done[key +7] = value;
            return this.updateField("done",this.Done);
        }
        return false;
    }

    public get Loop(): number[] {
        if (!(
            Array.isArray(this.SheetObject.loop) &&
            this.SheetObject.loop.length===15
        )) {
            this.SheetObject.loop = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
        return this.SheetObject.loop;
    }

    public loopAdd(key: number, value: number): boolean {
        key = Math.floor(key);
        if (
            key >= -7 &&
            key <= 7 &&
            value > 0
        ) {
            this.Loop[key+7] += value;
            return this.updateField("loop",this.Loop);
        }
        return false;
    }

    public loopSet(key: number, value: number): boolean {
        key = Math.floor(key);
        if (
            key >= -7 &&
            key <= 7 &&
            this.Loop[key+7] !== value
        ) {
            this.Loop[key+7] = value;
            return this.updateField("loop",this.Loop);
        }
        return false;
    }

    protected updateField(field: string, value: any): boolean {
        if (field in this.SheetObject) {
            return this.$updateDb({
                table:"sheets",
                pkey:"sheetId",
                id:this.SheetId,
                field: field,
                value: value,
            }) !== null;
        }
        return false;
    }

}


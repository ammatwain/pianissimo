import { ASCSS } from "./ASCSS";
import {
    TSheetObject,
    TMajorKey,
    TFixedNumberArray,
    TVariableMajorKeyNumberArray,
    SheetClass
} from "@Common/DataObjects";

import { LibraryNode } from "./LibraryNode";
import { ScoreNode } from "./ScoreNode";

ASCSS.SheetNode = {
};

export class SheetNode extends LibraryNode {

    constructor (sheetFields: SheetClass, parentScore: ScoreNode)  {
        super({adoptable: false, canAdopt: false});
        this.SheetFields = sheetFields;
        if (parentScore && parentScore instanceof ScoreNode) {
            parentScore.$appendNode(this);
        }
        this.$Caption = sheetFields.Title;

    }
/*
    protected fields: ISheetFields = {
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
    public get SheetFields(): SheetClass {
        return <SheetClass>this.fields;
    }

    public set SheetFields(sheetFields: SheetClass) {
        this.fields = sheetFields;
    }

    public get Id(): number {
        return this.SheetId;
    }

    public get ParentId(): number {
        return this.ParentScoreId;
    }

    public set ParentId(parentId: number) {
        this.ParentScoreId = parentId;
    }

    public get ParentScore(): ScoreNode{
        if (this.$Parent instanceof ScoreNode) {
            return this.$Parent;
        } else {
            return null;
        }
    }

    public get SheetId(): number {
        return this.SheetFields.SheetId;
    }

    public set SheetId(sheetId: number) {
        this.SheetFields.SheetId = sheetId;
    }

    public get ParentScoreId(): number {
        return this.SheetFields.ParentScoreId;
    }

    public set ParentScoreId(parentScoreId: number) {
        this.SheetFields.ParentScoreId = parentScoreId;
    }

    public get Sequence(): number {
        return this.SheetFields.Sequence;
    }

    public set Sequence(sequence: number) {
        this.SheetFields.Sequence = sequence;
    }

    public get Status(): string {
        return this.SheetFields.Status;
    }

    public set Status(status: string) {
        this.SheetFields.Status = status;
    }

    public get Title(): string {
        return this.SheetFields.Title;
    }

    public set Title(title: string) {
        this.SheetFields.Title = title;
    }

    public get Subtitle(): string {
        return this.SheetFields.Subtitle;
    }

    public set Subtitle(subtitle: string) {
        this.SheetFields.Subtitle = subtitle;
    }

    public get Author(): string {
        return this.ParentScore.Author;
    }

    public get MainKey(): TMajorKey {
        return this.ParentScore.MainKey;
    }

    public get Measures(): number {
        return this.ParentScore.Measures;
    }

    public get Parts(): string {
        return this.ParentScore.Parts;
    }

    public get ActiveKey(): TMajorKey {
        return this.SheetFields.ActiveKey;
    }

    public set ActiveKey(activeKey: TMajorKey) {
        if (this.SheetFields.activeKey !== activeKey) {
            this.SheetFields.activeKey = activeKey;
            this.FieldsChanged = true;
        }
    }

    public get ActiveKeys(): TVariableMajorKeyNumberArray {
        return <TVariableMajorKeyNumberArray>this.SheetFields.activeKeys.split(",").map(Number);
    }

    public set ActiveKeys(activeKeys: TVariableMajorKeyNumberArray) {
        const activeKeyString: string = activeKeys.sort().join(",");
        if (this.SheetFields.activeKeys !== activeKeyString) {
            this.SheetFields.activeKeys = activeKeyString;
            this.FieldsChanged = true;
        }
    }

    public addActiveKey(activeKey: TMajorKey): void {
        if (activeKey>=-7 && activeKey<=7){
            const activeKeys: TVariableMajorKeyNumberArray = this.ActiveKeys;
            if (activeKeys.indexOf(activeKey)===-1){
                activeKeys.push(activeKey);
                this.ActiveKeys = activeKeys.sort();
            }
        }
    }

    public removeActiveKey(activeKey: TMajorKey): void {
        if (activeKey>=-7 && activeKey<=7){
            const activeKeys: TVariableMajorKeyNumberArray = this.ActiveKeys;
            if (activeKeys.indexOf(activeKey)>=0){
                delete activeKeys[activeKeys.indexOf(activeKey)];
                this.ActiveKeys = activeKeys.sort();
            }
        }
    }

    public hasActiveKey(activeKey: TMajorKey): boolean {
        if (activeKey>=-7 && activeKey<=7){
            const activeKeys: TVariableMajorKeyNumberArray = this.ActiveKeys;
            return activeKeys.indexOf(activeKey) >= 0;
        }
        return false;
    }

    /*
    activeKeys: undefined,
    measureStart: undefined,
    measureEnd: undefined,
    selectedParts: undefined,
    selectedStaves: undefined,
    transposeBy: undefined,
    shot: undefined,
    done: undefined,
    loop: undefined,
*/
    public doSelected(): void{
        ;
    }
}

customElements.define("sheet-node", SheetNode);

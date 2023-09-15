import { ASCSS } from "./ASCSS";
import { ISheetFields } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";
import { ScoreNode } from "./ScoreNode";

ASCSS.SheetNode = {
};

export class SheetNode extends LibraryNode {

    constructor (sheetFields: ISheetFields, parentScore: ScoreNode)  {
        super({adoptable: false, canAdopt: false});
        this.SheetFields = sheetFields;
        if (this.ParentScore && this.ParentScore.ScoreId === this.ScoreId) {
            this.ParentScore.$appendNode(this);
        }
        this.$Caption = sheetFields.title;

    }

    protected fields: ISheetFields = {
        sheetId: undefined,
        scoreId: undefined,
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

    private get SheetFields(): ISheetFields {
        return <ISheetFields>this.fields;
    }

    private set SheetFields(sheetFields: ISheetFields) {
        this.fields = sheetFields;
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

    public get ScoreId(): number {
        return this.SheetFields.scoreId;
    }

    public set ScoreId(scoreId: number) {
        if (this.SheetFields.scoreId !== scoreId) {
            this.SheetFields.scoreId = scoreId;
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

    public get ParentScore(): ScoreNode{
        if (this.Parent instanceof ScoreNode) {
            return this.Parent;
        } else {
            return null;
        }
    }

/*
    public get Author(): string {
        return this.SheetFields.author;
    }

    public set Author(author: string) {
        if (this.SheetFields.author !== author) {
            this.SheetFields.author = author;
            this.FieldsChanged = true;
        }
    }
*/
/*
        public get MainKey(): number {
        return this.SheetFields.mainKey;
    }

    public set MainKey(mainKey: number) {
        if (this.SheetFields.mainKey !== mainKey) {
            this.SheetFields.mainKey = mainKey;
            this.FieldsChanged = true;
        }
    }
*/
/*
    public get Measures(): number {
        return this.SheetFields.measures;
    }

    public set Measures(measures: number) {
        if (this.SheetFields.measures !== measures) {
            this.SheetFields.measures = measures;
            this.FieldsChanged = true;
        }
    }
*/
/*
    public get Parts(): string {
        return this.SheetFields.parts;
    }

    public set Parts(parts: string) {
        if (this.SheetFields.parts !== parts) {
            this.SheetFields.parts = parts;
            this.FieldsChanged = true;
        }
    }
*/
}

customElements.define("sheet-node", SheetNode);

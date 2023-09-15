import { ASCSS } from "./ASCSS";
import { IScoreFields } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";
import { RackNode } from "./RackNode";

ASCSS.ScoreNode = {
};

export class ScoreNode extends LibraryNode {

    constructor (scoreFields: IScoreFields, parentRack: RackNode)  {
        super({adoptable: true, canAdopt: false});
        this.ScoreFields = scoreFields;
        if (this.ParentRack && this.ParentRack.RackId === this.RackId) {
            this.ParentRack.$appendNode(this);
        }
        this.$Caption = scoreFields.title;
        // else {
        //    throw new Error("BAD PARENT");
        //}

    }

    protected fields: IScoreFields = {
        scoreId: undefined,
        rackId: undefined,
        sequence: undefined,
        status: undefined,
        title: undefined,
        subtitle: undefined,
        author: undefined,
        mainKey: undefined,
        measures: undefined,
        parts: undefined,
    };

    private get ScoreFields(): IScoreFields {
        return <IScoreFields>this.fields;
    }

    private set ScoreFields(scoreFields: IScoreFields) {
        this.fields = scoreFields;
    }

    public get ScoreId(): number {
        return this.ScoreFields.scoreId;
    }

    public set ScoreId(scoreId: number) {
        if (this.ScoreFields.scoreId !== scoreId) {
            this.ScoreFields.scoreId = scoreId;
            this.FieldsChanged = true;
        }
    }

    public get RackId(): number {
        return this.ScoreFields.rackId;
    }

    public set RackId(rackId: number) {
        if (this.ScoreFields.rackId !== rackId) {
            this.ScoreFields.rackId = rackId;
            this.FieldsChanged = true;
        }
    }

    public get Sequence(): number {
        return this.ScoreFields.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.ScoreFields.sequence !== sequence) {
            this.ScoreFields.sequence = sequence;
            this.FieldsChanged = true;
        }
    }

    public get Status(): string {
        return this.ScoreFields.status;
    }

    public set Status(status: string) {
        if (this.ScoreFields.status !== status) {
            this.ScoreFields.status = status;
            this.FieldsChanged = true;
        }
    }

    public get Title(): string {
        return this.ScoreFields.title;
    }

    public set Title(title: string) {
        if (this.ScoreFields.title !== title) {
            this.ScoreFields.title = title;
            this.FieldsChanged = true;
        }
    }

    public get Subtitle(): string {
        return this.ScoreFields.subtitle;
    }

    public set Subtitle(subtitle: string) {
        if (this.ScoreFields.subtitle !== subtitle) {
            this.ScoreFields.subtitle = subtitle;
            this.FieldsChanged = true;
        }
    }

    public get Author(): string {
        return this.ScoreFields.author;
    }

    public set Author(author: string) {
        if (this.ScoreFields.author !== author) {
            this.ScoreFields.author = author;
            this.FieldsChanged = true;
        }
    }

    public get MainKey(): number {
        return this.ScoreFields.mainKey;
    }

    public set MainKey(mainKey: number) {
        if (this.ScoreFields.mainKey !== mainKey) {
            this.ScoreFields.mainKey = mainKey;
            this.FieldsChanged = true;
        }
    }

    public get Measures(): number {
        return this.ScoreFields.measures;
    }

    public set Measures(measures: number) {
        if (this.ScoreFields.measures !== measures) {
            this.ScoreFields.measures = measures;
            this.FieldsChanged = true;
        }
    }

    public get Parts(): string {
        return this.ScoreFields.parts;
    }

    public set Parts(parts: string) {
        if (this.ScoreFields.parts !== parts) {
            this.ScoreFields.parts = parts;
            this.FieldsChanged = true;
        }
    }

    //

    public get ParentRack(): RackNode{
        if (this.Parent instanceof RackNode) {
            return this.Parent;
        } else {
            return null;
        }
    }

}

customElements.define("score-node", ScoreNode);

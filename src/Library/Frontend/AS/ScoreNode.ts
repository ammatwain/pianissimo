import { ASCSS } from "./ASCSS";
import { TScoreObject, TMajorKey, TFixedNumberArray, TVariableMajorKeyNumberArray, ScoreClass, RackClass } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";
import { RackNode } from "./RackNode";

ASCSS.ScoreNode = {
};

export class ScoreNode extends LibraryNode {

    constructor (scoreFields: ScoreClass, parentRack: RackNode)  {
        super({adoptable: true, canAdopt: false});
        this.ScoreFields = scoreFields;
        console.log("RACK FIELDS",this.ScoreFields);
        if (parentRack && parentRack instanceof RackNode) {
            parentRack.$appendNode(this);
        }
        this.$Caption = this.ScoreFields.Title;
    }

    public get ScoreFields(): ScoreClass {
        return <ScoreClass>this.fields;
    }

    public set ScoreFields(scoreFields: ScoreClass) {
        this.fields = scoreFields;
    }

    public get Id(): number {
        return this.ScoreId;
    }

    public get ParentId(): number {
        return this.ParentRackId;
    }

    public set ParentId(parentId: number) {
        this.ParentRackId = parentId;
    }

    public get ScoreId(): number {
        return this.ScoreFields.ScoreId;
    }

    public set ScoreId(scoreId: number) {
        this.ScoreFields.ScoreId = scoreId;
    }

    public get ParentRackId(): number {
        return this.ScoreFields.ParentRackId;
    }

    public set ParentRackId(parentRackId: number) {
        this.ScoreFields.ParentRackId = parentRackId;
    }

    public get Sequence(): number {
        return this.ScoreFields.sequence;
    }

    public set Sequence(sequence: number) {
        this.ScoreFields.Sequence = sequence;
    }

    public get Status(): string {
        return this.ScoreFields.status;
    }

    public set Status(status: string) {
        this.ScoreFields.Status = status;
    }

    public get Title(): string {
        return this.ScoreFields.Title;
    }

    public set Title(title: string) {
        this.ScoreFields.Title = title;
    }

    public get Subtitle(): string {
        return this.ScoreFields.Subtitle;
    }

    public set Subtitle(subtitle: string) {
        this.ScoreFields.Subtitle = subtitle;
    }

    public get Author(): string {
        return this.ScoreFields.Author;
    }

    public set Author(author: string) {
        this.ScoreFields.Author = author;
    }

    public get MainKey(): TMajorKey {
        return this.ScoreFields.MainKey;
    }

    public set MainKey(mainKey: TMajorKey) {
        this.ScoreFields.MainKey = mainKey;
    }

    public get Measures(): number {
        return this.ScoreFields.Measures;
    }

    public set Measures(measures: number) {
        this.ScoreFields.Measures = measures;
    }

    public get Parts(): string {
        return this.ScoreFields.Parts;
    }

    public set Parts(parts: string) {
        this.ScoreFields.Parts = parts;
    }

    //

    public get ParentRack(): RackNode{
        if (this.$Parent instanceof RackNode) {
            return this.$Parent;
        } else {
            return null;
        }
    }

}

customElements.define("score-node", ScoreNode);

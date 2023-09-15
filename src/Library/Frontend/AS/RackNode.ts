import { ASCSS } from "./ASCSS";
import { IRackFields } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";

ASCSS.RackNode = {
};

export class RackNode extends LibraryNode {

    constructor (rackFields: IRackFields, parentRack: RackNode)  {
        super({adoptable: true, canAdopt: true});
        this.RackFields = rackFields;
        if (this.ParentRack && this.ParentRack.RackId === this.ParentRackId) {
            this.ParentRack.$appendNode(this);
        }
        this.$Caption = rackFields.title;
        // else {
        //    throw new Error("BAD PARENT");
        //}
    }

    protected fields: IRackFields = {
        rackId: undefined,
        parentRackId: undefined,
        sequence: undefined,
        status: undefined,
        title: undefined,
    };

    private get RackFields(): IRackFields {
        return <IRackFields>this.fields;
    }

    private set RackFields(rackFields: IRackFields) {
        this.fields = rackFields;
    }

    public get RackId(): number {
        return this.RackFields.rackId;
    }

    public set RackId(rackId: number) {
        if (this.RackFields.rackId !== rackId) {
            this.RackFields.rackId = rackId;
            this.FieldsChanged = true;
        }
    }

    public get ParentRackId(): number {
        if (this.ParentRack) {
            return this.ParentRack.RackId;
        } else if (this.RackFields && this.RackFields.parentRackId){
            return this.RackFields.parentRackId;
        } else {
            return 0;
        }
    }

    private set ParentRackId(parentRackId: number) {
        if (this.RackFields.parentRackId !== parentRackId) {
            this.RackFields.parentRackId = parentRackId;
            this.FieldsChanged = true;
        }
    }

    public get Sequence(): number {
        return this.RackFields.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.RackFields.sequence !== sequence) {
            this.RackFields.sequence = sequence;
            this.FieldsChanged = true;
        }
    }

    public get Status(): string {
        return this.RackFields.status;
    }

    public set Status(status: string) {
        if (this.RackFields.status !== status) {
            this.RackFields.status = status;
            this.FieldsChanged = true;
        }
    }

    public get Title(): string {
        return this.RackFields.title;
    }

    public set Title(title: string) {
        if (this.RackFields.title !== title) {
            this.RackFields.title = title;
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

customElements.define("rack-node", RackNode);

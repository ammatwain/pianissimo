import { ASCSS } from "./ASCSS";
import { TRackObject, RackClass } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";

ASCSS.RackNode = {
};

export class RackNode extends LibraryNode {

    constructor (rackFields: RackClass, parentRack: RackNode)  {
        super({adoptable: true, canAdopt: true});
        this.RackFields = rackFields;
        if (parentRack && parentRack instanceof RackNode) {
            parentRack.$appendNode(this);
        }
        this.$Caption = this.RackFields.Title;
        // else {
        //    throw new Error("BAD PARENT");
        //}
    }

    public get RackFields(): RackClass {
        return <RackClass>this.fields;
    }

    public set RackFields(rackFields: RackClass) {
        this.fields = rackFields;
    }

    public get Id(): number {
        return this.RackId;
    }

    public get ParentId(): number {
        return this.ParentRackId;
    }

    public set ParentId(parentId: number) {
        this.ParentRackId = parentId;
    }

    public get RackId(): number {
        return this.RackFields.RackId;
    }

    public set RackId(rackId: number) {
        this.RackFields.RackId = rackId;
    }

    public get ParentRackId(): number {
        if (this.RackFields && this.RackFields.ParentRackId){
            return this.RackFields.ParentRackId;
        } else {
            return 0;
        }
    }

    public set ParentRackId(parentRackId: number) {
        this.RackFields.ParentRackId = parentRackId;
    }

    public get Sequence(): number {
        return this.RackFields.Sequence;
    }

    public set Sequence(sequence: number) {
        this.RackFields.Sequence = sequence;
    }

    public get Status(): string {
        return this.RackFields.Status;
    }

    public set Status(status: string) {
        this.RackFields.Status = status;
    }

    public get Title(): string {
        return this.RackFields.Title;
    }

    public set Title(title: string) {
        this.RackFields.Title = title;
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

customElements.define("rack-node", RackNode);
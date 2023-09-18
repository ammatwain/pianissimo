import { ASCSS } from "./ASCSS";
import { TRackObject, RackClass } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";
import { ASModal } from "./ASModal";

ASCSS.RackNode = {
    ">.header":{
        ">.switcher":{
            ">svg":{
                ">path#arrow":{
                    "fill":"red",
                }
            },
        }
    },
};

export class RackNode extends LibraryNode {

    constructor (rackFields: RackClass, parentRack: RackNode | LibraryNode)  {
        super({adoptable: true, canAdopt: true});
        this.RackFields = rackFields;
        if (
            parentRack &&
            (
                parentRack instanceof RackNode ||
                parentRack instanceof LibraryNode
            )
        ) {
            parentRack.$appendNode(this);
        }
        this.$Caption = this.RackFields.Title;
        // else {
        //    throw new Error("BAD PARENT");
        //}
    }

    protected $preConnect(): void {
        super.$preConnect();
        this.$Elements.delete.style.display = "";
        this.$Elements.arrow.style.fill="black";
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        this.$Elements.add.onclick = (): void => {
            //ASModal.show("Rack Add");
            console.log(this.constructor.name, "clicked", "add");
        };
        this.$Elements.addRack.onclick = (): void => {
            //ASModal.show("Rack Add");
            this.newRackNode();
            console.log(this.constructor.name, "clicked", "add");
        };
        this.$Elements.delete.onclick = (): void => {
            ASModal.show("Rack Delete");
            console.log(this.constructor.name, "clicked", "add");
        };
        this.$Elements.settings.onclick = (): void => {
            ASModal.show("Rack Settings");
            console.log(this.constructor.name, "clicked", "add");
        };
    }

    private newRackObject(): TRackObject {
        return {
            rackId: Number(`2${Date.now()}`),
            parentRackId: this.Id,
            sequence: -1,
            status: null,
            title: "Default Title",
        };
    }

    protected newRackClass(): RackClass{
        const rackObject: TRackObject = this.newRackObject();
        return new RackClass(rackObject);
    }

    protected newRackNode(): RackNode {
        const rackClass: RackClass = this.newRackClass();
        const rackNode: RackNode = new RackNode(rackClass, this);
        this.$Closed = false;
        return rackNode;
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

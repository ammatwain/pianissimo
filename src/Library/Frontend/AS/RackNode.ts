import { ASCSS } from "./ASCSS";
import { RackClass } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";
import { ASModalRack } from "./ASModalRack";

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

    constructor (rackClass: RackClass, parentRack: RackNode | LibraryNode)  {
        super({adoptable: true, canAdopt: true});
        this.RackClass = rackClass;
        if (
            parentRack &&
            (
                parentRack instanceof RackNode ||
                parentRack instanceof LibraryNode
            )
        ) {
            parentRack.$appendNode(this);
        }
        this.$Caption = this.RackClass.Title;
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
            this.Root.Library.newScoreObject(this.Id, this.$Items.length);
            this.$Closed=false;
            console.log(this.constructor.name, "clicked", "add");
        };
        this.$Elements.addRack.onclick = (): void => {
            //ASModal.show("Rack Add");
            this.Root.Library.newRackObject(this.Id, this.$Items.length);
            this.$Closed=false;
            console.log(this.constructor.name, "clicked", "add");
        };
        this.$Elements.delete.onclick = (): void => {
            this.Library.deleteLibraryObject(this.RackId);
            console.log(this.constructor.name, "clicked", "delete");
        };
        this.$Elements.settings.onclick = (): void => {
            ASModalRack.showFromNode(this, "Rack Settings");
            console.log(this.constructor.name, "clicked", "settings");
        };
    }

    public $selfRemove(): RackNode {
        const parentLibraryNode: LibraryNode = this.ParentRack || this.Root || null;
        super.$selfRemove();
        if (parentLibraryNode &&
            parentLibraryNode instanceof LibraryNode
        ) {
            if (this.$Checked) {
                parentLibraryNode.$Checked = true;
            }
            if (parentLibraryNode.$Items.length < 1){
                parentLibraryNode.classList.add("closed");
            }
        }
        return this;
    }

    public get RackClass(): RackClass {
        return <RackClass>this.fields;
    }

    public set RackClass(rackFields: RackClass) {
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
        return this.RackClass.RackId;
    }

    public set RackId(rackId: number) {
        this.RackClass.RackId = rackId;
    }

    public get ParentRackId(): number {
        if (this.RackClass && this.RackClass.ParentRackId){
            return this.RackClass.ParentRackId;
        } else {
            return 0;
        }
    }

    public set ParentRackId(parentRackId: number) {
        this.RackClass.ParentRackId = parentRackId;
    }

    public get Sequence(): number {
        return this.RackClass.Sequence;
    }

    public set Sequence(sequence: number) {
        this.RackClass.Sequence = sequence;
    }

    public get Status(): string[] {
        return this.RackClass.Status;
    }

    public set Status(status: string[]) {
        this.RackClass.Status = status;
    }

    public get Title(): string {
        return this.RackClass.Title;
    }

    public set Title(title: string) {
        this.RackClass.Title = title;
    }

    public get ParentRack(): RackNode{
        if (this.$Parent instanceof RackNode) {
            return this.$Parent;
        } else {
            return null;
        }
    }

    public update(): void {
        this.$Caption = this.RackClass.Title;
    }
}

customElements.define("rack-node", RackNode);

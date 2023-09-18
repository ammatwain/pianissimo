import { ASCSS } from "./ASCSS";
import { ASNode } from "./ASNode";
import {LibraryClass, TRackObject, RackClass} from "@Common/DataObjects";
import { ASModal } from "./ASModal";

ASCSS.LibraryNode = {
};

export class LibraryNode extends ASNode {

    protected fields: LibraryClass;
    protected library: any;


    constructor(args: any){
        super(args);
        if (
            this instanceof LibraryNode &&
            this.constructor.name === "LibraryNode"
        ) {
            if (
                args &&
                "library" in args &&
                args.library &&
                args.library.constructor.name === "TLibrary"
            ) {
                this.Library = args.library;
            } else {
                throw new Error(`${this.constructor.name}: Bad Library Object`);
            }
        }
    }

    protected $preConnect(): void {
        super.$preConnect();
        this.$Elements.settings = <HTMLElement>document.createElement("i");
        this.$Elements.settings.classList.add("icons");
        this.$Elements.settings.innerHTML = "settings";
        this.$Actions.prepend(this.$Elements.settings);

        this.$Elements.add = <HTMLElement>document.createElement("i");
        this.$Elements.add.classList.add("icons");
        this.$Elements.add.innerHTML = "add_circle";
        this.$Actions.prepend(this.$Elements.add);

        this.$Elements.addRack = <HTMLElement>document.createElement("i");
        this.$Elements.addRack.classList.add("icons");
        this.$Elements.addRack.innerHTML = "create_new_folder";
        this.$Actions.prepend(this.$Elements.addRack);

        this.$Elements.delete = <HTMLElement>document.createElement("i");
        this.$Elements.delete.classList.add("icons");
        this.$Elements.delete.innerHTML = "delete";
        this.$Elements.delete.style.display = "none";
        this.$Actions.prepend(this.$Elements.delete);
        this.$Elements.arrow.style.fill="black";
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        if (this.$Level<1) {
            this.$Closed = false;
        } else {
            this.$Closed = true;
        }
        this.$Elements.add.onclick = (): void => {
            ASModal.show("Library Add");
            console.log(this.constructor.name, "***clicked", "add");
        };
        this.$Elements.addRack.onclick = (): void => {
            console.log(this.constructor.name, "***clicked", "add");
        };
        this.$Elements.delete.onclick = (): void => {
            ASModal.show("Library Delete");
            console.log(this.constructor.name, "***clicked", "add");
        };
        this.$Elements.settings.onclick = (): void => {
            ASModal.show("Library Settings");
            console.log(this.constructor.name, "***clicked", "add");
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

    public get FieldsChanged(): boolean {
        return this.fields.FieldsChanged;
    }

    public get Id(): number {
        return 0;
    }

    public get Library(): any {
        return this.Root.library;
    }

    public set Library(library: any) {
        if (this.Root) {
            this.Root.library = library;
        }
    }

    public get ParentId(): number {
        return 0;
    }

    public set ParentId(parentId: number) {
        ;
    }

    public get Root(): LibraryNode {
        if (
            this.$Root &&
            this.$Root instanceof LibraryNode
        ) {
            return <LibraryNode>this.$Root;
        } else {
            return null;
        }
    }

    public get Sequence(): number {
        return this.fields.Sequence ;
    }

    public set Sequence(sequence: number) {
        this.fields.Sequence = sequence;
    }

    public doCheckItems(): void{
        this.$Items.forEach((item: LibraryNode) => {
            item.Sequence = item.$Index;
        });
    }

    public doCheckParent(): void{
        if (this.$Parent instanceof LibraryNode){
            this.ParentId = this.$Parent.Id;
        } else {
            this.ParentId = 0;
        }
    }

}

customElements.define("library-node", LibraryNode);

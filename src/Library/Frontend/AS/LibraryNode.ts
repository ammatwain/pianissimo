import { ASCSS } from "./ASCSS";
import { ASNode } from "./ASNode";
import {LibraryClass, TRackObject, RackClass} from "@Common/DataObjects";
import { ASModal } from "./ASModal";
import { TLibrary } from "../Library/Library";

ASCSS.LibraryNode = {
};

export class LibraryNode extends ASNode {

    protected fields: LibraryClass;
    protected library: TLibrary;


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
            this.Root.Library.newScoreObject(this.Id, this.$Items.length);
            this.$Closed=false;
            console.log(this.constructor.name, "***clicked", "add");
        };
        this.$Elements.addRack.onclick = (): void => {
            this.Root.Library.newRackObject(this.Id, this.$Items.length);
            this.$Closed=false;
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

    public get FieldsChanged(): boolean {
        return this.fields.FieldsChanged;
    }

    public get Id(): number {
        return 0;
    }

    public get Library(): TLibrary {
        return this.Root.library;
    }

    public set Library(library: TLibrary) {
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

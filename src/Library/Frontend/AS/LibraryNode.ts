import { BranchClass } from "@Frontend/BranchClass";
import { ASCSS } from "./ASCSS";
import { ASNode } from "./ASNode";
import { NodeClass } from "./NodeClass";

ASCSS.LibraryNode = {
};

export class LibraryNode extends ASNode {

    private fieldsChanged: boolean = false;
    protected fields: any;

    constructor(args: any){
        super(args);
        if (this.$IsNotRoot && this instanceof LibraryNode && this.constructor.name!=="LibraryNode"){
            if (args && "branch" in args && args.branch instanceof BranchClass) {
                this.$.props.branchClass = args.branch;
                this.$.props.branchClass.ASNode = this;
            } else {
                this.$.props.branchClass = null;
                throw new Error(`${this.className} require a BranchClass in arguments`);
            }
        }
    }

    protected get FieldsChanged(): boolean {
        return this.fieldsChanged;
    }

    protected set FieldsChanged(fieldsChanged: boolean) {
        this.fieldsChanged = fieldsChanged;
    }

    public get Parent(): ASNode {
       return this.$Parent;
    }
}

customElements.define("library-node", LibraryNode);

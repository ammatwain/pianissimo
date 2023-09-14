import { BranchClass } from "@Frontend/BranchClass";
import { ASCSS } from "./ASCSS";
import { ASNode } from "./ASNode";
import { NodeClass } from "./NodeClass";

ASCSS.LibraryNode = {
};

export class LibraryNode extends ASNode {
    constructor(args: any){
        super(args);
        if (this.IsNotRoot && this instanceof LibraryNode && this.constructor.name!=="LibraryNode"){
            if (args && "branch" in args && args.branch instanceof BranchClass) {
                this.$.props.branchClass = args.branch;
                this.$.props.branchClass.ASNode = this;
            } else {
                this.$.props.branchClass = null;
                throw new Error(`${this.className} require a BranchClass in arguments`);
            }
        }
    }

    protected alwaysConnect(): void {
        super.alwaysConnect();
    }

}

customElements.define("library-node", LibraryNode);

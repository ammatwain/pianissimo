import { BranchClass } from "@Frontend/BranchClass";
import { ASCSS } from "./ASCSS";
import { ASNode } from "./ASNode";
import { BookNode } from "./BookNode";
import { SheetNode } from "./SheetNode";
import { LibraryNode } from "./LibraryNode";

ASCSS.SectionNode = {
};

export class SectionNode extends LibraryNode {
    public get Book(): BranchClass {
        if (
            this.Parent instanceof SheetNode &&
            this.Parent.Parent instanceof BookNode
        ) {
            return (<BookNode>(<SheetNode>this.Parent).Parent).Book;
        } else {
            return null;
        }
    }

    public get Sheet(): BranchClass {
        if (this.Parent instanceof SheetNode) {
            return (<SheetNode>this.Parent).Sheet;
        } else {
            return null;
        }
    }

    public get Section(): BranchClass {
        return this.$.props.branchClass;
    }

}

customElements.define("section-node", SectionNode);

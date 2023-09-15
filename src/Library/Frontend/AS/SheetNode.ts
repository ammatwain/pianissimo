import { BranchClass } from "@Frontend/BranchClass";
import { ASCSS } from "./ASCSS";
import { ASNode } from "./ASNode";
import { RackNode } from "./RackNode";
import { LibraryNode } from "./LibraryNode";

ASCSS.SheetNode = {
};

export class SheetNode extends LibraryNode {

    public get Book(): BranchClass {
        if (this.$Parent instanceof RackNode) {
            return (<RackNode>this.$Parent).Sheet;
        } else {
            return null;
        }
    }

    public get Sheet(): BranchClass {
        return this.$.props.branchClass;
    }

    public get Subtitle(): string {
        if (this.Sheet && this.Sheet.Name) {
            const titles: string[] = this.Sheet.Name.split(";");
            if (titles.length>0) {
                return titles[1];
            }
        }
        return null;
    }

    public get Title(): string {
        if (this.Sheet && this.Sheet.Name) {
            const titles: string[] = this.Sheet.Name.split(";");
            if (titles.length) {
                return titles[0];
            }
        }
        return null;
    }

}

customElements.define("sheet-node", SheetNode);

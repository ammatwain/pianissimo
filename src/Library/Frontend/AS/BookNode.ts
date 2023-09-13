import { BranchClass } from "@Frontend/BranchClass";
import { ASNode } from "./ASNode";
import { ASCSS } from "./ASCSS";
import { LibraryNode } from "./LibraryNode";

ASCSS.BookNode = {
};

export class BookNode extends LibraryNode {

    public get Book(): BranchClass {
        return <BranchClass>this.$.props.branchClass;
    }

    public get Subtitle(): string {
        if (this.Book && this.Book.Name) {
            const titles: string[] = this.Book.Name.split(";");
            if (titles.length>0) {
                return titles[1];
            }
        }
        return null;
    }

    public get Title(): string {
        if (this.Book && this.Book.Name) {
            const titles: string[] = this.Book.Name.split(";");
            if (titles.length) {
                return titles[0];
            }
        }
        return null;
    }
}

customElements.define("book-node", BookNode);

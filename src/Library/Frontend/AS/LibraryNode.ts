import { BranchClass } from "@Frontend/BranchClass";
import { ASCSS } from "./ASCSS";
import { ASNode } from "./ASNode";
import { NodeClass } from "./NodeClass";
import {TMajorKey, TFixedNumberArray, TVariableMajorKeyNumberArray, LibraryClass} from "@Common/DataObjects";

ASCSS.LibraryNode = {
};

export class LibraryNode extends ASNode {

    private fieldsChanged: boolean = false;
    protected fields: LibraryClass;

    constructor(args: any){
        super(args);
    }

    public get FieldsChanged(): boolean {
        return this.fieldsChanged;
    }

    public set FieldsChanged(fieldsChanged: boolean) {
        this.fieldsChanged = fieldsChanged;
    }

    public get Id(): number {
        return 0;
    }

    public get ParentId(): number {
        return 0;
    }

    public set ParentId(parentId: number) {
        ;
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

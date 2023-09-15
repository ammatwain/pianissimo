import { BranchClass } from "@Frontend/BranchClass";
import { ASCSS } from "./ASCSS";
import { LibraryNode } from "./LibraryNode";

ASCSS.RackNode = {
};

interface IRackFields {
	rackId: number;
	parentRackId: number;
	sequence: number;
	status: string;
	title: string;
} 

export class RackNode extends LibraryNode {

    private fieldsChanged: boolean = false;

    private rackFields: IRackFields = {
        rackId: undefined,
        parentRackId: undefined,
        sequence: undefined,
        status: undefined,
        title: undefined,
    }

    private get RackFields(): IRackFields {
        return this.rackFields;
    }

    private set RackFields(fields: IRackFields) {
        this.rackFields = fields;
    }

    private get FieldsChanged(): boolean {
        return this.fieldsChanged;
    }

    private set FieldsChanged(fieldsChanged: boolean) {
        this.fieldsChanged = fieldsChanged;
    }

    public get RackId(): number {
        return this.RackFields.rackId;
    }

    public set RackId(rackId: number) {
        if (this.RackFields.rackId !== rackId) {
            this.RackFields.rackId = rackId;
            this.FieldsChanged = true;
        }
    }

    public get ParentRackId(): number {
        return this.RackFields.parentRackId;
    }

    public set ParentRackId(parentRackId: number) {
        if (this.RackFields.parentRackId !== parentRackId) {
            this.RackFields.parentRackId = parentRackId;
            this.FieldsChanged = true;
        }
    }

    public get Sequence(): number {
        return this.RackFields.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.RackFields.sequence !== sequence) {
            this.RackFields.sequence = sequence;
            this.FieldsChanged = true;
        }
    }

    public get Status(): string {
        return this.RackFields.status;
    }

    public set Status(status: string) {
        if (this.RackFields.status !== status) {
            this.RackFields.status = status;
            this.FieldsChanged = true;
        }
    }

    public get Title(): string {
        return this.RackFields.title;
    }

    public set Title(title: string) {
        if (this.RackFields.title !== title) {
            this.RackFields.title = title;
            this.FieldsChanged = true;
        }
    }

    public get Book(): BranchClass {
        return <BranchClass>this.$.props.branchClass;
    }


}

customElements.define("rack-node", RackNode);

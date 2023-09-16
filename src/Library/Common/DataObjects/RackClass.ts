import { TLibraryObject } from "./TLibraryObject";
import { TRackObject } from "./TRackObject";
import { LibraryClass } from "./LibraryClass";

export class RackClass extends LibraryClass {

    constructor(fields: TRackObject){
        super(fields);
    }

 /*
    protected fields: IRackFields = {
        rackId: undefined,
        parentRackId: undefined,
        sequence: undefined,
        status: undefined,
        title: undefined,
    };
*/
    declare protected fields: TRackObject;

    public set Fields(fields: TRackObject) {
        super.Fields = fields;
    }

    public get RackFields(): TRackObject {
        return <TRackObject>this.fields;
    }

    public get Id(): number {
        return this.RackId;
    }

    public get ParentId(): number {
        return this.ParentRackId;
    }

    protected set ParentId(parentId: number) {
        this.ParentRackId = parentId;
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
        if (this.RackFields && this.RackFields.parentRackId){
            return this.RackFields.parentRackId;
        } else {
            return 0;
        }
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
        if ("title" in this.RackFields) {
            return this.RackFields.title;
        } else {
            return "";
        }
    }

    public set Title(title: string) {
        if (this.RackFields.title !== title) {
            this.RackFields.title = title;
            this.FieldsChanged = true;
        }
    }
}


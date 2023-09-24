import { TLibraryObject } from "./TLibraryObject";
import { TRackObject } from "./TRackObject";
import { LibraryClass } from "./LibraryClass";

export class RackClass extends LibraryClass {

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
            console.log(this.constructor.name, "changed", "RackId");
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
            if (this.updateField("parentRackId",parentRackId)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Sequence(): number {
        return this.RackFields.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.RackFields.sequence !== sequence) {
            this.RackFields.sequence = sequence;
            this.FieldsChanged = true;
            if (this.updateField("sequence",sequence)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Status(): string {
        return this.RackFields.status;
    }

    public set Status(status: string) {
        if (this.RackFields.status !== status) {
            this.RackFields.status = status;
            this.FieldsChanged = true;
            console.log(this.constructor.name, "changed", "Status");
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
            if (this.updateField("title",title)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    protected updateField(field: string, value: number | string): boolean {
        return this.$updateDb({
            table:"racks",
            pkey:"rackId",
            id:this.RackId,
            field: field,
            value: value,
        }) !== null;
    }
}


import { TRackObject } from "./TRackObject";
import { LibraryClass } from "./LibraryClass";

export class RackClass extends LibraryClass {

    declare protected fields: TRackObject;

    public set Fields(fields: TRackObject) {
        super.Fields = fields;
    }

    public get RackObject(): TRackObject {
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
        return this.RackObject.rackId;
    }

    public set RackId(rackId: number) {
        if (this.RackObject.rackId !== rackId) {
            this.RackObject.rackId = rackId;
            this.FieldsChanged = true;
            console.log(this.constructor.name, "changed", "RackId");
        }
    }

    public get ParentRackId(): number {
        if (this.RackObject && this.RackObject.parentRackId){
            return this.RackObject.parentRackId;
        } else {
            return 0;
        }
    }

    public set ParentRackId(parentRackId: number) {
        if (this.RackObject.parentRackId !== parentRackId) {
            this.RackObject.parentRackId = parentRackId;
            this.FieldsChanged = true;
            if (this.updateField("parentRackId",parentRackId)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Sequence(): number {
        return this.RackObject.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.RackObject.sequence !== sequence) {
            this.RackObject.sequence = sequence;
            this.FieldsChanged = true;
            if (this.updateField("sequence",sequence)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Status(): string[] {
        return this.RackObject.status;
    }

    public set Status(status: string[]) {
        const oldStatus: string = JSON.stringify(this.RackObject.status);
        const newStatus: string = JSON.stringify(status.sort());

        if (oldStatus !== newStatus) {
            this.RackObject.status = JSON.parse(newStatus);
            this.FieldsChanged = true;
            console.log(this.constructor.name, "changed", "Status");
        }
    }

    public get Title(): string {
        if ("title" in this.RackObject) {
            return this.RackObject.title;
        } else {
            return "";
        }
    }

    public set Title(title: string) {
        if (this.RackObject.title !== title) {
            this.RackObject.title = title;
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


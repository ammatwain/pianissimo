import { TLibraryObject } from "./TLibraryObject";

export class LibraryClass {

    constructor(fields: TLibraryObject){
        this.Fields = fields;
    }

    declare protected fields: TLibraryObject;

    private fieldsChanged: boolean = false;

    public get Fields(): TLibraryObject {
        return this.fields;
    }

    public set Fields(fields: TLibraryObject) {
        this.fields = fields;
    }

    public get Id(): number {
        if ("rackId" in this.fields) {
            return this.fields.rackId;
        } else if ("scoreId" in this.fields) {
            return this.fields.scoreId;
        } else if ("sheetId" in this.fields) {
            return this.fields.sheetId;
        }
        return 0;
    }

    public get ParentId(): number {
        if ("parentRackId" in this.fields) {
            return this.fields.parentRackId;
        } else if ("scoreRackId" in this.fields) {
            return this.fields.scoreRackId;
        }
        return 0;
    }

    public get Sequence(): number {
        return this.fields.sequence ;
    }

    public set Sequence(sequence: number) {
        if (this.fields.sequence !== sequence) {
            this.fields.sequence = sequence;
            this.FieldsChanged = true;
        }
    }

    protected get FieldsChanged(): boolean {
        return this.fieldsChanged;
    }

    protected set FieldsChanged(fieldsChanged: boolean) {
        this.fieldsChanged = fieldsChanged;
    }

}

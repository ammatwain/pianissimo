import { TLibraryObject } from "./TLibraryObject";

export class LibraryClass {
    protected notificationActive: boolean = false;
    constructor(fields: TLibraryObject){
        this.fields = fields;
        this.notificationActive = true;
    }

    protected fields: TLibraryObject;

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
        /*
        if ("parentRackId" in this.fields) {
            return this.fields.parentRackId;
        } else if ("scoreRackId" in this.fields) {
            return this.fields.scoreRackId;
        }
        */
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

    public get FieldsChanged(): boolean {
        return this.fieldsChanged;
    }

    public set FieldsChanged(fieldsChanged: boolean) {
        this.fieldsChanged = fieldsChanged;
        if (this.notificationActive && this.fieldsChanged) {
            //window.electron.ipcRenderer.invoke("request-field-changed").then((result: any)=>{
            console.log(this.constructor.name, this.fieldsChanged, this.fields);
        }
    }

    protected $updateField(query: {table: string, pkey: string, id: number, field: string, value: number | string }): boolean {
        return <boolean>window.electron.ipcRenderer.invoke(
            "request-update-field",
            query
        ).then((result: boolean)=>{
            return result;
        });
    }

    protected updateField(field: string, value: number | string): boolean {
        return null;
    }

}

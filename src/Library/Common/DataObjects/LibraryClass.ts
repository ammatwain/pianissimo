import { TLibraryObject } from "./TLibraryObject";
import { TLibrary } from "@Frontend/Library/Library";

export class LibraryClass {
    protected library: TLibrary;
    protected notificationActive: boolean = false;
    constructor(fields: TLibraryObject, library: TLibrary){
        this.library = library;
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

    protected $updateDb(query: {table: string, pkey: string, id: number, field: string, value: number | string }): boolean {
        this.library.updateDb(query);
    }

    protected updateField(field: string, value: number | string): boolean {
        return null;
    }

}

export interface IEntry {
    id?: string;
    type?: "book"|"sheet"|"section";
    parent?: IEntry;
    bookid?: number;
    sheetid?: number;
    sectionid?: number;
    order?: number;
    path?: string;
    name?: string;
    key?: number;
    keys?: number[];
    shot?: number[];
    done?: number[];
    custom?: any;
    bpm?: number;
    hands?: "both"|"left"|"right";
    sheet?: Buffer;
    children?: IEntry[];
    measures?: number[];
    checked?: boolean;
}

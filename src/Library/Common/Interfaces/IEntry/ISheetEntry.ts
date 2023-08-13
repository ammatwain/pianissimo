import { IEntry } from "./IEntry";

export interface ISheetEntry extends IEntry {
    sheetid: number;
    bookid: number;
    order: number;
    name: string;
    key: number;
    keys: number[];
    shot: number[];
    done: number[];
    custom: any;
    sheet: Buffer;
}

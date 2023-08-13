import { IEntry } from "./IEntry";

export interface IBookEntry extends IEntry {
    bookid: number;
    order: number;
    path: string;
    custom: any;
    children: IEntry[];
}

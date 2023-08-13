import { IEntry } from "./IEntry";

export interface ISectionEntry extends IEntry {
    sectionid?: number;
    sheetid?: number;
    order?: number;
    checked?: boolean;
    name?: string;
    key?: number;
    keys?: number[];
    shot?: number[];
    done?: number[];
    hands?: "both"|"left"|"right";
    bpm?: number;
    custom?: any;
    measures?: number[];
}

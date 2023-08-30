import { IBranchType } from "@Interfaces/IBranchType";

export interface IBranchObject {
    //COMMON, BOOK
    id?: number;
    parentid?: number;
    sequence?: number;
    type?: IBranchType;
    title: string;
    // SHEET
    subtitle: string;
    mainkey: number;
    measurecount: number;
    instrument: number;
    score: Buffer;
    // SECTION
    measurestart: number;
    measureend: number;
    activekey: number;
    keys: string;
    hands: string;
    shot: string;
    fail: string;
    bpmratio: number;
    // OLD
    name?: string;
    custom?: any;
    data?: Buffer;
    //

    $path?: string;
    $children?: IBranchObject[];
}

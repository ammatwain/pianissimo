import {IBranchObject} from "../../Common";
import { PPBook } from "./PPBook";

export class PPSheet extends PPBook {

    public get SubTitle(): string {
        return this.BranchObject.subtitle;
    }

    public get MainKey(): number {
        return this.BranchObject.mainkey;
    }

    public get MeasureCount(): number {
        return this.BranchObject.measurecount || 0;
    }

    public get Instrument(): number {
        return this.BranchObject.measurecount || 0;
    }

    public get Score(): Buffer {
        return null;
        return this.BranchObject.score;
    }

}
/*
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
*/

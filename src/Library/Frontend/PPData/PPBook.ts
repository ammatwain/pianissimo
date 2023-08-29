import { IBranchObject } from "../../Common/Interfaces/IBranchObject";
import { PPData } from "./PPData";

export class PPBook extends PPData {

    constructor(branchObject: IBranchObject, parent: PPBook = null){
        super(branchObject, parent);
    }

    public get Parent(): PPBook {
        return <PPBook>super.Parent;
    }

    public get ParentId(): number {
        return this.BranchObject.parentid || 0;
    }

    public get Sequence(): number {
        return this.BranchObject.sequence || 0;
    }

    public get Title(): string {
        return this.BranchObject.title || "";
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

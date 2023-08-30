import { IBranchObject } from "@Interfaces/IBranchObject";

export class PPData {

    private branchObject: IBranchObject = null;
    private parent: PPData = null;

    constructor(branchObject: IBranchObject, parent: PPData){
        this.branchObject = branchObject;
        this.parent = parent;
    }

    public get BranchObject(): IBranchObject {
        return this.branchObject;
    }

    public get Parent(): PPData {
        return this.parent;
    }

    public get Id(): number {
        return this.BranchObject.id;
    }

    public get Type(): string {
        return this.BranchObject.type;
    }
/*
    public get ParentId(): number {
        return this.BranchObject.parentid;
    }

    public get Sequence(): number {
        return this.BranchObject.sequence;
    }

    public get Title(): string {
        return this.BranchObject.title;
    }
*/
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

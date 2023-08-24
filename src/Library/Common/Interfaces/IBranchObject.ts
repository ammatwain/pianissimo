//import { IBranchCustom } from "./IBranchCustom";
import { IBranchType } from "./IBranchType";

export interface IBranchObject {
    id?: number;
    parentid?: number;
    sequence?: number;
    type?: IBranchType;
    name?: string;
    custom?: any;
    data?: Buffer;
    //
    $path?: string;
    $children?: IBranchObject[];
}

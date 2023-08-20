import { BranchClass } from "../../../Frontend";
import { IBranchObject } from "../IBranchObject";
export type BranchClassCollectionItem = {[index: number]: BranchClass };
export interface ITreeStore {
    treeBranchesObject?: IBranchObject[];
    treeBranchesClass?: BranchClass[];
    linearBranchesClass?: BranchClass[];
    branchesById?: BranchClassCollectionItem;
    leafBranchesById?: BranchClassCollectionItem;
    defaultValues?: string[];
    defaultDisables?: any[];
}

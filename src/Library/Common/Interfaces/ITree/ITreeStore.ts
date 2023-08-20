import { BranchClass } from "../../../Frontend";
export type BranchClassCollectionItem = {[index: number]: BranchClass };
export interface ITreeStore {
    treeBranches?: BranchClass[];
    linearBranches?: BranchClass[];
    branchesById?: BranchClassCollectionItem;
    leafBranchesById?: BranchClassCollectionItem;
    defaultValues?: number[];
    defaultDisables?: number[];
}

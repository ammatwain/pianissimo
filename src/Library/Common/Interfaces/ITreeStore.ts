import { BranchClass } from "@Frontend/BranchClass";
import { BranchClassCollectionItem } from "./IBranchClassCollectionItem";

export interface ITreeStore {
    treeBranches?: BranchClass[];
    linearBranches?: BranchClass[];
    branchesById?: BranchClassCollectionItem;
    leafBranchesById?: BranchClassCollectionItem;
    defaultValues?: number[];
    defaultDisables?: number[];
}

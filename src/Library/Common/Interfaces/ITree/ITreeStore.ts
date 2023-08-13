import { ITreeBranch } from "./ITreeBranch";

export interface ITreeStore {
    treeBranches?: ITreeBranch[];
    branchesById?: {[index: string]: ITreeBranch };
    leafBranchesById?: {[index: string]: ITreeBranch };
    defaultValues?: string[];
    defaultDisables?: any[];
}

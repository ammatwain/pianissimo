import { IArborBranch } from "./IArborBranch";

export interface IArborStore {
    arborBranches?: IArborBranch[];
    branchesById?: {[index: string]: IArborBranch };
    leafBranchesById?: {[index: string]: IArborBranch };
    defaultValues?: string[];
    defaultDisables?: any[];
}

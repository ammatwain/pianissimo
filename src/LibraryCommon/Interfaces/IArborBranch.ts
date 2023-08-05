import { IWorkItem } from "./IWorkItem";

export interface IArborBranch extends IWorkItem {
    checked?: boolean;
    disabled?: boolean;
    status?: number;
    parent?: IArborBranch;
    children?: IArborBranch[];
}

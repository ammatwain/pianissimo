import { IEntry } from "../IEntry";

export interface ITreeBranch extends IEntry {
    checked?: boolean;
    disabled?: boolean;
    status?: number;
    parent?: ITreeBranch;
    percent?: number;
    children?: ITreeBranch[];
}

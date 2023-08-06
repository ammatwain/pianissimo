import { IInfoFile } from "./IInfoFile";

export interface IWorkItem extends IInfoFile{
    id?: string;
    path?: string;
    name?: string;
    level?: number;
    children?: IWorkItem[];
}

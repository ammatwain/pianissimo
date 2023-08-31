import { IFixedCOFNumberArray } from "@Interfaces/IFixedCOFNumberArray";
import { IVariableCOFNumberArray } from "@Interfaces/IVariableCOFNumberArray";

export interface IBranchCustom{
    checked?: boolean;
    disabled?: boolean;
    status?: number;
    mainKey?: number;
    activeKeys?: IVariableCOFNumberArray;
    shot?: [IFixedCOFNumberArray,IFixedCOFNumberArray];
    done?: [IFixedCOFNumberArray,IFixedCOFNumberArray];
    measures?: number;
    measureStart?: number;
    measureEnd?: number;
    percent?: number;

}

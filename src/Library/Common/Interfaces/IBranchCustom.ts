export type IVariableCOFNumberArray = [number?,number?,number?,number?,number?,number?,number?,number?,number?,number?,number?,number?,number?,number?,number?];
export type IFixedCOFNumberArray = [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number];

export interface IBranchCustom{
    checked?: boolean;
    disabled?: boolean;
    status?: number;
    mainKey?: number;
    activeKeys?: IVariableCOFNumberArray;
    shot?: [IFixedCOFNumberArray,IFixedCOFNumberArray];
    done?: [IFixedCOFNumberArray,IFixedCOFNumberArray];
    percent?: number;
}

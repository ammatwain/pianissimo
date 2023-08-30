import { IBranchObject } from "@Interfaces/IBranchObject";

export interface IWalk {
    TreeObjects: IBranchObject[];
    LinearObjects: IBranchObject[];
    TreeAsJSONString: string;
    LinearAsJSONString: string;
}

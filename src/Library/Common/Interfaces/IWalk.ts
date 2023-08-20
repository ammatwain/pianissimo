import { IBranchObject } from "./IBranchObject";

export interface IWalk {
    TreeObjects: IBranchObject[];
    LinearObjects: IBranchObject[];
    TreeAsJSONString: string;
    LinearAsJSONString: string;
}

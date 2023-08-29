import { IBranchObject } from "../../Common/Interfaces/IBranchObject";

export interface IWalk {
    TreeObjects: IBranchObject[];
    LinearObjects: IBranchObject[];
    TreeAsJSONString: string;
    LinearAsJSONString: string;
}

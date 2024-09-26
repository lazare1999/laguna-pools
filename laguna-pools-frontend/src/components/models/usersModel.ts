// types.ts
import {BranchModel} from "./branchModel";

export interface User {
    userId: number;
    username: string;
    password: string;
    lastAuthDate: string;
    isLocked: boolean;
    roles: Array<string>;
    rolesIds: Array<number>;
    branch: BranchModel;
}

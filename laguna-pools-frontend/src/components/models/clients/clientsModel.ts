import {GroupModel} from "../groups/GroupModel";
import {TYPES} from "../../clients/constants";

export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    age: string;
    debt: number;
    expDate: string;
    doctorCheckTill: string;
    phoneNumber: string;
    idStatus: boolean;
    contractStatus: boolean;
    notes: string;
    type: typeof TYPES[number];
    groups: GroupModel[];
}

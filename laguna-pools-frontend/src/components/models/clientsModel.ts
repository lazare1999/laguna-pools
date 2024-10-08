import {GroupModel} from "./GroupModel";

export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    age: string;
    cost: number;
    expDate: string;
    doctorCheckTill: string;
    phoneNumber: string;
    idStatus: boolean;
    contractStatus: boolean;
    notes: string;
    parent: string;
    groups: GroupModel[];
}

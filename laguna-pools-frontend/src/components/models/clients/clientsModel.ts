import {GroupModel} from "../groups/GroupModel";
import {TYPES} from "../../clients/constants";

export interface Client {
    id: number | null;
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

export const DEFAULT_CLIENT = {
    id: null,
    firstName: "",
    lastName: "",
    age: "",
    debt: 0,
    expDate: "",
    doctorCheckTill: "",
    phoneNumber: "",
    idStatus: false,
    contractStatus: false,
    notes: "",
    type: "guest",
    groups: []
}
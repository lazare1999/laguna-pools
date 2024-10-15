import {Client} from "../clients/clientsModel";

export interface AttendancesModel {
    id: number;
    time: string;
    attended: boolean;
    client: Client;
}
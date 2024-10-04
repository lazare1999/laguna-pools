import {Client} from "./clientsModel";

export interface AttendancesModel {
    id: number;
    time: string;
    attended: boolean;
    client: Client;
}
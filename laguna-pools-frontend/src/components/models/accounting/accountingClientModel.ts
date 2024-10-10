import {Client} from "../clients/clientsModel";
import {TransactionEnum} from "../../../utils/enums/TransactionEnum";

export interface AccountingClientModel {
    id: number;
    amount: string;
    date: string;
    type: TransactionEnum;
    client: Client;
}
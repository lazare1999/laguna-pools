import {TransactionEnum} from "../../../utils/enums/TransactionEnum";

export interface AccountingFilters {
    dayTo: string;
    dayFrom: string;
    type: string;
    branches: string[];
    name: string;
    lastname: string;
}

export const defaultAccountingFilters: AccountingFilters = {
    dayTo: '',
    dayFrom: '',
    type: TransactionEnum.CASH,
    branches: [],
    name: '',
    lastname: '',
};
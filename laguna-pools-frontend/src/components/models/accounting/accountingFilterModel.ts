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
    type: '',
    branches: [],
    name: '',
    lastname: '',
};
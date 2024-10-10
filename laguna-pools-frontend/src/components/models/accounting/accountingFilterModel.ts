export interface AccountingFilters {
    dayTo: string;
    dayFrom: string;
    branches: string[];
}

export const defaultAccountingFilters: AccountingFilters = {
    dayTo: '',
    dayFrom: '',
    branches: []
};
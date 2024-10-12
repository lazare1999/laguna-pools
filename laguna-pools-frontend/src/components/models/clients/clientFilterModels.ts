export interface ClientFilters {
    phone: string;
    lastName: string;
    day: string;
    hour: string;
    branches: string[];
}

export const defaultClientFilters: ClientFilters = {
    phone: '',
    lastName: '',
    day: '',
    hour: '',
    branches: []
};

export interface DialogFilters {
    name: string;
    contractStatus: boolean;
    idStatus: boolean;
    type: string;
    birthDayFrom: string;
    birthDayTo: string;
    expDayFrom: string;
    expDayTo: string;
    docDayFrom: string;
    docDayTo: string;
    debtFrom: number;
    debtTo: number;
    notes: string;
}

export const defaultDialogFilters: DialogFilters = {
    name: '',
    contractStatus: false,
    idStatus: false,
    type: '',
    birthDayFrom: '',
    birthDayTo: '',
    expDayFrom: '',
    expDayTo: '',
    docDayFrom: '',
    docDayTo: '',
    debtFrom: 0.0,
    debtTo: 0.0,
    notes: ''
};

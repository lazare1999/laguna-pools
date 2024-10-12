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
    costFrom: number;
    costTo: number;
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
    costFrom: 0.0,
    costTo: 0.0,
    notes: ''
};

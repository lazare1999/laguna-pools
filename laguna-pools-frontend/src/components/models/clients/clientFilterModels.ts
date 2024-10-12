export interface ClientFilters {
    name: string;
    lastName: string;
    branches: string[];
}

export const defaultClientFilters: ClientFilters = {
    name: '',
    lastName: '',
    branches: []
};

export interface DialogFilters {
    contractStatus: boolean;
    idStatus: boolean;
    phone: string;
    type: string;
    birthDayFrom: string;
    birthDayTo: string;
    expDayFrom: string;
    expDayTo: string;
    docDayFrom: string;
    docDayTo: string;
    costFrom: number;
    costTo: number;
    selectedGroups: string[];
    notes: string;
}

export const defaultDialogFilters: DialogFilters = {
    contractStatus: false,
    idStatus: false,
    phone: '',
    type: '',
    birthDayFrom: '',
    birthDayTo: '',
    expDayFrom: '',
    expDayTo: '',
    docDayFrom: '',
    docDayTo: '',
    costFrom: 0.0,
    costTo: 0.0,
    selectedGroups: [],
    notes: ''
};

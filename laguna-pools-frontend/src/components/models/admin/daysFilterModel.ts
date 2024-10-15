export interface DaysFilterModel {
    attended: boolean,
    selectedDay: string,
    selectedTime: string,
    branches: string[]
}

export const defaultDaysFilters: DaysFilterModel = {
    attended: true,
    selectedDay: "",
    selectedTime: "",
    branches: [],
};
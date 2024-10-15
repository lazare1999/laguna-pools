import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import {defaultClientFilters, defaultDialogFilters} from "../models/clients/clientFilterModels";

export const fetchClientsFor = (id: number, branches: string[]) => {


    const params: Record<string, any> = {
        ...defaultClientFilters,
        ...defaultDialogFilters,
        pageKey: "0",
        pageSize: "9999999",
        branches: branches,
        selectedGroups: [id],

    }
    const queryString = new URLSearchParams(params).toString();
    return authClient.request(`clients/all?${queryString}`, HttpMethod.GET);
}

export const getCurrentTime = (): Date => {
    const now = new Date();
    const gmtPlus4Offset = 4 * 60;
    const localOffset = now.getTimezoneOffset();
    return new Date(now.getTime() + (gmtPlus4Offset + localOffset) * 60 * 1000);
};

export const getString = (time: Date): string => {
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hours = String(time.getHours()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:00:00`;
}
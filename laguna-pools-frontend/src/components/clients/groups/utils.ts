import authClient from "../../../api/api";
import {HttpMethod} from "../../../utils/enums/httpMethodEnum";
import {defaultClientFilters, defaultDialogFilters} from "../../models/clientFilterModels";

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
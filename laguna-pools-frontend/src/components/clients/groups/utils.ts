import {DayEnum} from "../../../utils/enums/DayEnum";
import {HoursEnum} from "../../../utils/enums/HoursEnum";
import authClient from "../../../api/api";
import {HttpMethod} from "../../../utils/enums/httpMethodEnum";
import {defaultClientFilters, defaultDialogFilters} from "../../models/clientFilterModels";

export const fetchClientsFor = (day: DayEnum, hour: HoursEnum, branches: string[]) => {
    const group = day.toString() + " - " + hour.toString();
    console.log(group);

    const params: Record<string, any> = {
        ...defaultClientFilters,
        ...defaultDialogFilters,
        pageKey: "0",
        pageSize: "9999999",
        branches: branches,
        selectedGroups: group,

    }
    const queryString = new URLSearchParams(params).toString();
    return authClient.request(`clients/all?${queryString}`, HttpMethod.GET);
}
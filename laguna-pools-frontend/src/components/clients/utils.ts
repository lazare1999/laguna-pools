import {HoursEnum} from "../../utils/HoursEnum";
import {Attendance} from "../models/attnedance";
import {HttpMethod} from "../../utils/httpMethodEnum";

import authClient from "../../api/api";
import {ClientFilters} from "../models/clientFilterModels";

const determineHoursEnum = (hour: number): HoursEnum => {
    if (hour < 0 || hour > 23) {
        throw new Error("Hour must be between 0 and 23.");
    }

    const formattedHour = hour.toString().padStart(2, '0');

    return HoursEnum[`HOUR_${formattedHour}` as keyof typeof HoursEnum];
};

export const getAttendancesListById = async (id: number, page: number, rowsPerPage: number): Promise<Attendance[]> => {
    const result = await authClient.request("attendances/client", HttpMethod.POST, {
        pageKey: page,
        pageSize: rowsPerPage,
        clientId: id
    });

    if (result && result.data && result.data.attendances) {
        return result.data.attendances.map((attendance: {
            id: number;
            clientId: number;
            time: string;
            attended: boolean;
        }) => {
            const dateTime = new Date(attendance.time);
            const day = dateTime.toLocaleDateString();
            const hours: HoursEnum = determineHoursEnum(dateTime.getHours());

            return {
                day,
                time: hours,
                attended: attendance.attended
            } as Attendance;
        });
    }

    return [];
};


function concatenateDayAndHour(day: string, hour: HoursEnum): Date {
    const dateTimeString = `${day}T${hour}:00`;
    return new Date(dateTimeString);
}


export const addAttendance = async (clientId: number, day: string, hour: HoursEnum, attended: boolean) => {
    const time = `${day}T${hour}:00`;
    return authClient.request("attendances", HttpMethod.POST, {
        clientId: clientId,
        time: time,
        attended: attended
    });
}


export const getClients = async (pageKey: string, pageSize: string, filters: ClientFilters) => {
    const params: Record<string, any> = {
        pageKey: 0,
        pageSize: 9999999,
        ...filters,
        branches: filters.branches.join(','),
    };

    const queryString = new URLSearchParams(params).toString();
    return authClient.request(`clients/all?${queryString}`, HttpMethod.GET);
}

const getUserRowFromResponse = (client: any) => {
    return [`${client.firstName} ${client.lastName}`, client.age, client.cost, client.phoneNumber, client.notes]
}

export const getAllFilteredClientsGrid = async (filters: ClientFilters) => {
    const allClients = await getClients("0", "9999999", filters);

    console.log(allClients.data.content);

    const clientsArrays: string[][] = allClients.data.content.map((client: any) =>
        getUserRowFromResponse(client).map((value: string | number | null) => value ? value.toString() : "")
    );

    return [["Client", "Age", "Cost", "Phone", "Notes"]].concat(clientsArrays);
}
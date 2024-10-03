import {HoursEnum} from "../../utils/enums/HoursEnum";
import {Attendance} from "../models/attnedance";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";

import authClient from "../../api/api";

const determineHoursEnum = (hour: number): HoursEnum => {
    if (hour < 0 || hour > 23) {
        throw new Error("Hour must be between 0 and 23.");
    }

    const formattedHour = hour.toString().padStart(2, '0');

    return HoursEnum[`HOUR_${formattedHour}` as keyof typeof HoursEnum];
};

export const getAttendancesListById = async (
    id: number,
    page: number,
    rowsPerPage: number
): Promise<{ attendances: Attendance[]; total: number }> => {
    const result = await authClient.request("attendances/client", HttpMethod.POST, {
        pageKey: page,
        pageSize: rowsPerPage,
        clientId: id,
    });

    if (result && result.data && result.data.attendances) {
        const attendances = result.data.attendances.map((attendance: {
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
                attended: attendance.attended,
            } as Attendance;
        });

        return {
            attendances,
            total: result.data.total,
        };
    }

    return {attendances: [], total: 0};
};

export const addAttendance = async (clientId: number, day: string, hour: HoursEnum, attended: boolean) => {
    const time = `${day}T${hour}:00`;
    return authClient.request("attendances", HttpMethod.POST, {
        clientId: clientId,
        time: time,
        attended: attended
    });
}

export const getClients = async (pageKey: string, pageSize: string, filters: any) => {
    const params: Record<string, any> = {
        pageKey: pageKey,
        pageSize: pageSize,
        ...filters,
        branches: filters.branches.join(','),
    };

    const queryString = new URLSearchParams(params).toString();
    return authClient.request(`clients/all?${queryString}`, HttpMethod.GET);
}

const getUserRowFromResponse = (client: any) => {

    const groups: string = client.groups.map((group: any) => `${group.day} ${group.hour}`).join('\n');

    return [
        client.firstName,
        client.lastName,
        client.age,
        client.expDate,
        client.doctorCheckTill,
        client.cost,
        client.phoneNumber,
        client.idStatus,
        client.contractStatus,
        client.parent,
        groups,
        client.notes
    ]
}

export const getAllFilteredClientsGrid = async (filters: any) => {
    const allClients = await getClients("0", "9999999", filters);

    const clientsArrays: string[][] = allClients.data.content.map((client: any) =>
        getUserRowFromResponse(client).map((value: any) => value ? value.toString() : "")
    );

    return [[
        "First Name",
        "Last name",
        "Birthday",
        "Expiration",
        "Doctor check",
        "Cost", "Phone",
        "Id Status",
        "Contract",
        "Parent",
        "Groups",
        "Notes"]].concat(clientsArrays);
}
import {HoursEnum} from "../../utils/HoursEnum";
import {Attendance} from "../models/attnedance";
import {HttpMethod} from "../../utils/httpMethodEnum";

import authClient from "../../api/api";

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
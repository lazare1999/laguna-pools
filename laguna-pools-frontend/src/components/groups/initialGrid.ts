import {DayEnum} from "../../utils/enums/DayEnum";
import {HoursEnum} from "../../utils/enums/HoursEnum";

export interface GroupInfo {
    groupId: number | null;
    count: number;
}

export interface GroupsCustomObject {
    map: Record<string, GroupInfo>;
}

const createHourlyMap = (): Record<string, GroupInfo> => {
    return Object.fromEntries(Object.values(HoursEnum).map(hour => [hour, {groupId: null, count: 0}]));
};

export const INITIAL_GRID: { [key in DayEnum]: GroupsCustomObject } = {
    [DayEnum.MONDAY]: {map: createHourlyMap()},
    [DayEnum.TUESDAY]: {map: createHourlyMap()},
    [DayEnum.WEDNESDAY]: {map: createHourlyMap()},
    [DayEnum.THURSDAY]: {map: createHourlyMap()},
    [DayEnum.FRIDAY]: {map: createHourlyMap()},
    [DayEnum.SATURDAY]: {map: createHourlyMap()},
    [DayEnum.SUNDAY]: {map: createHourlyMap()},
};

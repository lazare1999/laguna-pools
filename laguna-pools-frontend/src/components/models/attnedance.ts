import {HoursEnum} from "../../utils/enums/HoursEnum";

export interface Attendance {
    day: string;
    time: HoursEnum;
    attended: boolean;
}
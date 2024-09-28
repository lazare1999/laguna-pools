import {HoursEnum} from "../../utils/HoursEnum";

export interface Attendance {
    day: string;
    time: HoursEnum;
    attended: boolean;
}
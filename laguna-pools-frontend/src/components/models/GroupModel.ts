import {DateEnum} from "../../utils/DateEnum";
import {HoursEnum} from "../../utils/HoursEnum";

export interface GroupModel {
    id: number;
    day: DateEnum;
    hour: HoursEnum;
}

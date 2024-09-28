import {DayEnum} from "../../utils/DayEnum";
import {HoursEnum} from "../../utils/HoursEnum";

export interface GroupModel {
    id: number;
    day: DayEnum;
    hour: HoursEnum;
}

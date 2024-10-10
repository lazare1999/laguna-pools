import {DayEnum} from "../../../utils/enums/DayEnum";
import {HoursEnum} from "../../../utils/enums/HoursEnum";

export interface GroupModel {
    id: number;
    day: DayEnum;
    hour: HoursEnum;
}

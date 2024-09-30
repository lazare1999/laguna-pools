import React, {useEffect, useState} from 'react';
import {DayEnum} from "../../../utils/enums/DayEnum";
import {HoursEnum} from "../../../utils/enums/HoursEnum";
import './groupScheduleTable.css';
import {AlertDialog} from "../../../utils/alertsUtils";
import {Button} from "@mui/material";
import {Refresh} from "@mui/icons-material";
import authClient from "../../../api/api";
import {HttpMethod} from "../../../utils/enums/httpMethodEnum";

const GroupScheduleTable: React.FC = () => {
    const [data, setData] = useState<{ [key in DayEnum]: { [key in HoursEnum]: number } }>({
        [DayEnum.MONDAY]: {
            [HoursEnum.HOUR_09]: 0,
            [HoursEnum.HOUR_10]: 0,
            [HoursEnum.HOUR_11]: 0,
            [HoursEnum.HOUR_12]: 0,
            [HoursEnum.HOUR_13]: 0,
            [HoursEnum.HOUR_14]: 0,
            [HoursEnum.HOUR_15]: 0,
            [HoursEnum.HOUR_16]: 0,
            [HoursEnum.HOUR_17]: 0,
            [HoursEnum.HOUR_18]: 0,
            [HoursEnum.HOUR_19]: 0,
            [HoursEnum.HOUR_20]: 0,
            [HoursEnum.HOUR_21]: 0
        },
        [DayEnum.TUESDAY]: {
            [HoursEnum.HOUR_09]: 0,
            [HoursEnum.HOUR_10]: 0,
            [HoursEnum.HOUR_11]: 0,
            [HoursEnum.HOUR_12]: 0,
            [HoursEnum.HOUR_13]: 0,
            [HoursEnum.HOUR_14]: 0,
            [HoursEnum.HOUR_15]: 0,
            [HoursEnum.HOUR_16]: 0,
            [HoursEnum.HOUR_17]: 0,
            [HoursEnum.HOUR_18]: 0,
            [HoursEnum.HOUR_19]: 0,
            [HoursEnum.HOUR_20]: 0,
            [HoursEnum.HOUR_21]: 0
        },
        [DayEnum.WEDNESDAY]: {
            [HoursEnum.HOUR_09]: 0,
            [HoursEnum.HOUR_10]: 0,
            [HoursEnum.HOUR_11]: 0,
            [HoursEnum.HOUR_12]: 0,
            [HoursEnum.HOUR_13]: 0,
            [HoursEnum.HOUR_14]: 0,
            [HoursEnum.HOUR_15]: 0,
            [HoursEnum.HOUR_16]: 0,
            [HoursEnum.HOUR_17]: 0,
            [HoursEnum.HOUR_18]: 0,
            [HoursEnum.HOUR_19]: 0,
            [HoursEnum.HOUR_20]: 0,
            [HoursEnum.HOUR_21]: 0
        },
        [DayEnum.THURSDAY]: {
            [HoursEnum.HOUR_09]: 0,
            [HoursEnum.HOUR_10]: 0,
            [HoursEnum.HOUR_11]: 0,
            [HoursEnum.HOUR_12]: 0,
            [HoursEnum.HOUR_13]: 0,
            [HoursEnum.HOUR_14]: 0,
            [HoursEnum.HOUR_15]: 0,
            [HoursEnum.HOUR_16]: 0,
            [HoursEnum.HOUR_17]: 0,
            [HoursEnum.HOUR_18]: 0,
            [HoursEnum.HOUR_19]: 0,
            [HoursEnum.HOUR_20]: 0,
            [HoursEnum.HOUR_21]: 0
        },
        [DayEnum.FRIDAY]: {
            [HoursEnum.HOUR_09]: 0,
            [HoursEnum.HOUR_10]: 0,
            [HoursEnum.HOUR_11]: 0,
            [HoursEnum.HOUR_12]: 0,
            [HoursEnum.HOUR_13]: 0,
            [HoursEnum.HOUR_14]: 0,
            [HoursEnum.HOUR_15]: 0,
            [HoursEnum.HOUR_16]: 0,
            [HoursEnum.HOUR_17]: 0,
            [HoursEnum.HOUR_18]: 0,
            [HoursEnum.HOUR_19]: 0,
            [HoursEnum.HOUR_20]: 0,
            [HoursEnum.HOUR_21]: 0
        },
        [DayEnum.SATURDAY]: {
            [HoursEnum.HOUR_09]: 0,
            [HoursEnum.HOUR_10]: 0,
            [HoursEnum.HOUR_11]: 0,
            [HoursEnum.HOUR_12]: 0,
            [HoursEnum.HOUR_13]: 0,
            [HoursEnum.HOUR_14]: 0,
            [HoursEnum.HOUR_15]: 0,
            [HoursEnum.HOUR_16]: 0,
            [HoursEnum.HOUR_17]: 0,
            [HoursEnum.HOUR_18]: 0,
            [HoursEnum.HOUR_19]: 0,
            [HoursEnum.HOUR_20]: 0,
            [HoursEnum.HOUR_21]: 0
        },
        [DayEnum.SUNDAY]: {
            [HoursEnum.HOUR_09]: 0,
            [HoursEnum.HOUR_10]: 0,
            [HoursEnum.HOUR_11]: 0,
            [HoursEnum.HOUR_12]: 0,
            [HoursEnum.HOUR_13]: 0,
            [HoursEnum.HOUR_14]: 0,
            [HoursEnum.HOUR_15]: 0,
            [HoursEnum.HOUR_16]: 0,
            [HoursEnum.HOUR_17]: 0,
            [HoursEnum.HOUR_18]: 0,
            [HoursEnum.HOUR_19]: 0,
            [HoursEnum.HOUR_20]: 0,
            [HoursEnum.HOUR_21]: 0
        },
    });

    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const hours = Object.values(HoursEnum);

    const dayMap = {
        [DayEnum.MONDAY]: 'ორშაბათი',
        [DayEnum.TUESDAY]: 'სამშაბათი',
        [DayEnum.WEDNESDAY]: 'ოთხშაბათი',
        [DayEnum.THURSDAY]: 'ხუთშაბათი',
        [DayEnum.FRIDAY]: 'პარასკევი',
        [DayEnum.SATURDAY]: 'შაბათი',
        [DayEnum.SUNDAY]: 'კვირა',
    };

    const columnSums = hours.map(hour =>
        Object.values(data).reduce((sum, dayCounts) => sum + (dayCounts[hour] || 0), 0)
    );

    const getCellClass = (count: number, isSums: boolean) => {
        const blueLimit = 0;
        const redLimit = isSums ? 70 : 10; // Adjusted based on whether it's a sum or not

        if (count === blueLimit) return 'cell-blue';
        if (count >= redLimit) return 'cell-red';
        return 'cell-yellow';
    };

    const fetchData = async () => {
        try {
            const response = await authClient.request('groups', HttpMethod.GET);
            if (response.status === 200) {
                const fetchedData = response.data.data;
                setData(fetchedData);
            } else {
                setAlertMessage('Network response was not ok');
                setAlertOpen(true);
            }
        } catch (error) {
            setAlertMessage(`Error fetching data: ${error}`);
            setAlertOpen(true);
        }
    };

    useEffect(() => {
        fetchData().then(r => r);
    }, []);

    const handleRefresh = () => {
        fetchData().then(r => r);
    };

    return (
        <div className="table-container">
            <table className="schedule-table">
                <thead>
                <tr>
                    <th>დრო/დღე</th>
                    {hours.map((hour) => (
                        <th key={hour}>{hour}</th>
                    ))}
                    <th>ჯამში რაოდენობა</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(dayMap).map((day) => {
                    const dayCounts = data[day as DayEnum];
                    const daySum = Object.values(dayCounts).reduce((acc, count) => acc + count, 0);

                    return (
                        <tr key={day}>
                            <td>{dayMap[day as DayEnum]}</td>
                            {hours.map((hour) => {
                                const count = dayCounts[hour] || 0;
                                return (
                                    <td key={hour} className={getCellClass(count, false)}>
                                        {count}
                                    </td>
                                );
                            })}
                            <td>{daySum}</td>
                        </tr>
                    );
                })}
                </tbody>
                <tfoot>
                <tr>
                    <td>სულ რაოდენობა</td>
                    {columnSums.map((total, index) => (
                        <td key={index} className={getCellClass(total, true)}>
                            {total}
                        </td>
                    ))}
                    <td>{columnSums.reduce((acc, total) => acc + total, 0)}</td>
                </tr>
                </tfoot>
            </table>
            <Button
                variant="outlined"
                onClick={handleRefresh}
                sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    flexGrow: 0,
                    display: "flex",
                    alignItems: "center",
                    height: "50px",
                }}
            >
                <Refresh/>
            </Button>
            <AlertDialog
                title="Error"
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
                message={alertMessage}
            />
        </div>
    );
};

export default GroupScheduleTable;

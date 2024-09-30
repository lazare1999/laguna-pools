import React, {useEffect, useState} from 'react';
import {DayEnum} from "../../../utils/enums/DayEnum";
import {HoursEnum} from "../../../utils/enums/HoursEnum";
import './groupScheduleTable.css';
import {AlertDialog, Toast} from "../../../utils/alertsUtils";
import {Button} from "@mui/material";
import {Refresh} from "@mui/icons-material";
import authClient from "../../../api/api";
import {HttpMethod} from "../../../utils/enums/httpMethodEnum";

const GroupScheduleTable: React.FC = () => {
    const [data, setData] = useState<{ [key in DayEnum]: number[] }>({
        [DayEnum.MONDAY]: [],
        [DayEnum.TUESDAY]: [],
        [DayEnum.WEDNESDAY]: [],
        [DayEnum.THURSDAY]: [],
        [DayEnum.FRIDAY]: [],
        [DayEnum.SATURDAY]: [],
        [DayEnum.SUNDAY]: [],
    });

    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const hours = [
        HoursEnum.HOUR_09,
        HoursEnum.HOUR_10,
        HoursEnum.HOUR_11,
        HoursEnum.HOUR_12,
        HoursEnum.HOUR_13,
        HoursEnum.HOUR_14,
        HoursEnum.HOUR_15,
        HoursEnum.HOUR_16,
        HoursEnum.HOUR_17,
        HoursEnum.HOUR_18,
        HoursEnum.HOUR_19,
        HoursEnum.HOUR_20,
        HoursEnum.HOUR_21,
    ];

    const columnSums = Array(hours.length).fill(0);
    Object.values(data).forEach(dayCounts => {
        dayCounts.forEach((count, index) => {
            columnSums[index] += count;
        });
    });

    const getCellClass = (count: number, isSums: boolean) => {
        const blueLimit = 0;
        let redLimit = 10;
        if (isSums) {
            redLimit *= 7;
        }

        if (count === blueLimit) return 'cell-blue';
        if (count >= redLimit) return 'cell-red';
        return 'cell-yellow';
    };

    const fetchData = async () => {
        try {
            const response = await authClient.request('groups', HttpMethod.GET);

            if (response.status === 200) {
                debugger;
                const fetchedData = await response.data.data;
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
                    <th>დრო</th>
                    {hours.map((hour) => (
                        <th key={hour}>{hour}</th>
                    ))}
                    <th>ჯამში რაოდენობა</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(data).map((day) => {
                    const dayCounts = data[day as DayEnum];
                    const daySum = dayCounts.reduce((acc, count) => acc + count, 0);

                    return (
                        <tr key={day}>
                            <td>{day}</td>
                            {dayCounts.map((count, index) => (
                                <td key={index} className={getCellClass(count, false)}>
                                    {count}
                                </td>
                            ))}
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
            <Toast
                open={toastOpen}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
                options={{autoHideDuration: 3000}}
            />
            <AlertDialog
                open={alertOpen}
                title="Error"
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default GroupScheduleTable;

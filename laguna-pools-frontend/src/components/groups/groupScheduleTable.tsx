import React, {useEffect, useState} from 'react';
import {DayEnum} from "../../utils/enums/DayEnum";
import {HoursEnum} from "../../utils/enums/HoursEnum";
import {AlertDialog} from "../../utils/alertsUtils";
import {Button, FormControl, InputLabel, SelectChangeEvent} from "@mui/material";
import {Refresh} from "@mui/icons-material";
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import ClientModal from "./clientsDialog";
import {GroupsCustomObject, INITIAL_GRID} from "./initialGrid";
import {fetchClientsFor, getCurrentTime} from "./utils";
import {Client} from "../models/clients/clientsModel";
import BranchSelector from "../clients/branchSelector";
import {ClientFilters, defaultClientFilters} from "../models/clients/clientFilterModels";
import {UserApiService} from "../../api/userApiService";
import LoadingPage from "../common/loadingPage";

const GroupScheduleTable: React.FC = () => {
    const [data, setData] = useState<{ [key in DayEnum]: GroupsCustomObject }>(INITIAL_GRID);
    const [isModalOpen, setModalOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [filters, setFilters] = useState<ClientFilters>(defaultClientFilters);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [shouldLoad, setShouldLoad] = useState<boolean>(false);

    const handleOpenModal = (id: number | null, day: DayEnum, hour: HoursEnum) => {
        setLoading(true);
        setShouldLoad(isCurrentTimeCell(day, hour));

        if (id === null) return;

        fetchClientsFor(id, filters.branches).then(res => {
            const newClients = res.data.content.map((c: Client) => ({
                id: c.id,
                firstName: c.firstName,
                lastName: c.lastName
            }));

            setClients(newClients);
            setLoading(false);
        });
        setModalOpen(true);
    };

    const [userRoles, setUserRoles] = useState<string[]>([]);

    useEffect(() => {
        UserApiService.getRoles().then(r => {
            setUserRoles(r.data.roles);
        }).catch(err => console.error(err));
    }, []);

    const handleCloseModal = () => setModalOpen(false);

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
        Object.values(data).reduce((sum, dayCounts) => {
            if (dayCounts && dayCounts.map) {
                return sum + (dayCounts.map[hour] ? dayCounts.map[hour].count : 0);
            }
            return sum;
        }, 0)
    );

    const getCellClass = (count: number, isSums: boolean) => {
        const blueLimit = 0;
        const redLimit = isSums ? 70 : 10; // Adjusted based on whether it's a sum or not

        if (count === blueLimit) return 'cell-blue';
        if (count >= redLimit) return 'cell-red';
        return 'cell-yellow';
    };

    const fetchData = async () => {
        setTableLoading(true);
        try {
            const response = await authClient.request(`groups?branches=${filters.branches}`, HttpMethod.GET);
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
        setTableLoading(false);
    };

    useEffect(() => {
        fetchData().then(r => r);
    }, [filters]);

    const handleRefresh = () => {
        fetchData().then(r => r);
    };

    const isCurrentTimeCell = (day: DayEnum, hour: HoursEnum): boolean => {
        const gmtPlus4Time = getCurrentTime()

        const currentDay: string = DayEnum[gmtPlus4Time
            .toLocaleString('en-US', {weekday: 'long'})
            .toUpperCase() as keyof typeof DayEnum];

        const currentHour: string = gmtPlus4Time
            .getHours()
            .toString()
            .padStart(2, '0') + ':00';

        return currentDay === day && currentHour === hour;
    }

    const getClassByCell = (day: DayEnum, hour: HoursEnum): string => {
        return isCurrentTimeCell(day, hour) ? " highlight-cell" : "";
    };

    const handleBranchChange = (event: SelectChangeEvent<string[]>) => {
        const {value} = event.target;
        setFilters({
            ...filters,
            branches: typeof value === "string" ? value.split(",") : value,
        });
    }

    const hasRole = (role: string) => {
        return userRoles.includes(role);
    };

    return (
        <>
            {hasRole("ROLE_LAGUNA_ADMIN") &&
                <FormControl style={{width: '50%', marginTop: 10}}>
                    <InputLabel id="branches-select-label-groups">Branches</InputLabel>
                    <BranchSelector id={"branches-select-label-groups"}
                                    labelId={"branches-select-label-groups-label-id"}
                                    filters={filters} handleBranchChange={handleBranchChange}/>
                </FormControl>

            }
            {tableLoading ? <LoadingPage label={"Loading Table Data..."}/> :
                <>
                    <div className="table-container">
                        <table className="schedule-table">
                            <thead>
                            <tr>
                                <th>დღე/დრო</th>
                                {hours.map((hour) => (
                                    <th key={hour}>{hour}</th>
                                ))}
                                <th>ჯამში რაოდენობა</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(dayMap).map((day) => {
                                const dayCounts = data[day as DayEnum];
                                const dayMapValues = dayCounts?.map || {};

                                const daySum = Object.values(dayMapValues).reduce((acc, groupInfo) => acc + (groupInfo.count || 0), 0);
                                return (
                                    <tr key={day}>
                                        <td>{dayMap[day as DayEnum]}</td>
                                        {hours.map((hour) => {
                                            const groupInfo = dayMapValues[hour] || {groupId: null, count: 0};
                                            const count = groupInfo.count || 0;

                                            return (
                                                <td
                                                    onClick={() => handleOpenModal(groupInfo.groupId, day as DayEnum, hour)}
                                                    key={hour}
                                                    className={`${getCellClass(count, false)}${getClassByCell(day as DayEnum, hour)}`}
                                                >
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
                </>
            }
            <ClientModal loading={loading} open={isModalOpen} clients={clients} handleClose={handleCloseModal}
                         shouldSave={shouldLoad}/>
        </>
    );
};

export default GroupScheduleTable;

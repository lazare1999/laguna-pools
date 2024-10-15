import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from "@mui/material";
import {Refresh} from "@mui/icons-material";
import LoadingPage from "../common/loadingPage";
import {AttendancesModel} from "../models/attendances/attendancesModel";
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import {HoursEnum} from "../../utils/enums/HoursEnum";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BranchSelector from "../clients/branchSelector";
import {DaysFilterModel, defaultDaysFilters} from "../models/admin/daysFilterModel";
import PlaylistRemoveOutlinedIcon from "@mui/icons-material/PlaylistRemoveOutlined";

const COLUMNS = ["#", "Client", "Time", "Attended"];

const DaysTable: React.FC = () => {
    const [filters, setFilters] = useState<DaysFilterModel>(defaultDaysFilters);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [attendances, setAttendances] = useState<AttendancesModel[]>([]);

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    const handleTimeChange = (event: any) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            selectedTime: event.target.value,
        }));
    };

    const handleDayChange = (event: any) => {

        setFilters(prevFilters => ({
            ...prevFilters,
            selectedDay: event.target.value,
        }));

    };

    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseAlert = () => setAlertOpen(false);

    const handleToggleAttended = () => {
        setFilters(prevFilters => ({
            ...prevFilters,
            attended: !prevFilters.attended,
        }));
    };

    const handleClearAll = () => {
        setPage(0);
        setRowsPerPage(5);
        setFilters(defaultDaysFilters);
    };

    const handleBranchChange = (event: SelectChangeEvent<string[]>) => {
        const {value} = event.target;
        setFilters({
            ...filters,
            branches: typeof value === "string" ? value.split(",") : value,
        });
    };

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = {
                pageKey: page,
                pageSize: rowsPerPage,
                ...filters
            };
            const queryString = new URLSearchParams(params as any).toString();
            const response = await authClient.request(`attendances?${queryString}`, HttpMethod.GET);

            if (Array.isArray(response.data.attendances)) {
                setAttendances(response.data.attendances);
                setCount(response.data.total);
            } else {
                setAlertMessage(`Fetched data is not an array: ${response.data}`);
                setAlertOpen(true);
            }
        } catch (error) {
            setAlertMessage(`Error fetching clients: ${error}`);
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        const date = new Date(dateString);
        return date.toLocaleString(undefined, options); // Adjust locale as needed
    };

    useEffect(() => {
        fetchAttendance().then(r => r);
    }, [filters, page, rowsPerPage]);

    return (
        <>
            <Paper>
                <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2, gap: 1}}>
                    <TextField
                        label="Day"
                        type="date"
                        variant="outlined"
                        value={filters.selectedDay}
                        onChange={handleDayChange}
                        margin="normal"
                        sx={{flexGrow: 1, height: 64}}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                    <FormControl sx={{flexGrow: 1, minWidth: 150}}>
                        <InputLabel id="time-select-label">Time</InputLabel>
                        <Select labelId="time-select-label" id="time-select" value={filters.selectedTime}
                                onChange={handleTimeChange} label="Time">
                            {Object.values(HoursEnum).map((hour) => (
                                <MenuItem key={hour} value={hour}>
                                    {hour}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{flexGrow: 1, minWidth: 150}}>
                        <InputLabel id="branches-select-label-days">Branches</InputLabel>
                        <BranchSelector id="branches-select-label-days" labelId="branches-select-label-days-label-id"
                                        filters={filters} handleBranchChange={handleBranchChange}/>
                    </FormControl>

                    <Button variant="outlined" onClick={handleToggleAttended}
                            sx={{display: "flex", alignItems: "center", height: "50px"}}>
                        {filters.attended ? <CheckCircleOutlineIcon color="success"/> :
                            <CancelOutlinedIcon color="error"/>}
                    </Button>

                    <Button variant="outlined" onClick={fetchAttendance}
                            sx={{display: "flex", alignItems: "center", height: "50px"}}>
                        <Refresh/>
                    </Button>

                    <Button variant="outlined" onClick={handleClearAll}
                            sx={{display: "flex", alignItems: "center", height: "50px"}}>
                        <PlaylistRemoveOutlinedIcon/>
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {COLUMNS.map((column) => (
                                    <TableCell key={column}>{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={COLUMNS.length} align="center">
                                        <LoadingPage label="Loading Data..."/>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                attendances.map((at, index) => (
                                    <TableRow key={at.id}>
                                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                        <TableCell>{`${at.client.firstName} ${at.client.lastName}`}</TableCell>
                                        <TableCell>{formatDate(at.time)}</TableCell>
                                        <TableCell>{at.attended ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={count}
                                 rowsPerPage={rowsPerPage} page={page} onPageChange={handlePageChange}
                                 onRowsPerPageChange={handleRowsPerPageChange}/>

                <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}
                          anchorOrigin={{vertical: "top", horizontal: "center"}}>
                    <Alert onClose={handleCloseAlert} severity="error" sx={{width: "100%"}}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Paper>
        </>
    );
};

export default DaysTable;

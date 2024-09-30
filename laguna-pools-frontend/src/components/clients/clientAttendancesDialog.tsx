import React, {useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from '@mui/material';
import {HoursEnum} from "../../utils/enums/HoursEnum";
import {Client} from "../models/clientsModel";
import {Attendance} from "../models/attnedance";
import {addAttendance, getAttendancesListById} from "./utils";
import LoadingPage from "../common/loadingPage";

interface ClientAttendancesDialogProps {
    client: Client;
    isModalOpen: boolean;
    modalCloseHandler: () => void;
}

const ClientAttendancesDialog: React.FC<ClientAttendancesDialogProps> = ({
                                                                             client,
                                                                             isModalOpen,
                                                                             modalCloseHandler,
                                                                         }) => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [newAttendance, setNewAttendance] = useState<Attendance | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        getAttendancesListById(client.id, page, rowsPerPage)
            .then(result => {
                setAttendances(result.attendances);
                setTotal(result.total);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.error(err)
            });
    }, [isModalOpen, page, rowsPerPage]);

    const handleHourChange = (index: number, value: HoursEnum) => {
        setNewAttendance(prevState => {
            if (prevState == null) {
                return {
                    day: "",
                    time: value,
                    attended: false
                } as Attendance;
            } else {
                return {
                    day: prevState.day,
                    time: value,
                    attended: prevState.attended
                }
            }
        });
    };

    const handleCheckboxChange = (attended: boolean) => {
        setNewAttendance(prevState => {
            if (prevState) {
                return {...prevState, attended};
            }
            return null;
        });
    };

    const handleCloseModal = () => {
        modalCloseHandler();
        setNewAttendance(null);
    };

    const handleAddNewRow = () => {
        setNewAttendance({day: '', time: HoursEnum.HOUR_09, attended: false});
    };

    const handleSaveAttendance = () => {
        if (newAttendance) {
            addAttendance(client.id, newAttendance.day, newAttendance.time, newAttendance.attended)
                .then(() => {
                    const updatedAttendances = [...attendances, newAttendance].sort(
                        (a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()
                    );
                    setAttendances(updatedAttendances);
                    setNewAttendance(null);
                })
                .catch(err => console.error(err));
        }
    };

    const getRowStyle = (attended: boolean) => {
        return attended ? {backgroundColor: 'rgba(93,213,118,0.86)', color: 'white'} : {
            backgroundColor: '#e36758',
            color: 'white'
        };
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <div style={{padding: '20px', backgroundColor: 'white', margin: '7% auto', width: '50%'}}>
                    <Button onClick={handleAddNewRow} variant="outlined" style={{marginBottom: '20px'}}>
                        + Add Attendance
                    </Button>

                    <div style={{maxHeight: '600px', overflowY: 'auto'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Day</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Attended</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            <LoadingPage label="Loading Data..."/>
                                        </TableCell>
                                    </TableRow>
                                ) : <>
                                    {attendances
                                        .map((attendance, index) => (
                                            <TableRow key={index} style={getRowStyle(attendance.attended)}>
                                                <TableCell>{attendance.day}</TableCell>
                                                <TableCell>{attendance.time}</TableCell>
                                                <TableCell>{attendance.attended ? 'Yes' : 'No'}</TableCell>
                                            </TableRow>
                                        ))}

                                    {newAttendance && (
                                        <TableRow>
                                            <TableCell>
                                                <TextField
                                                    required
                                                    label="Day"
                                                    type="date"
                                                    value={newAttendance.day}
                                                    slotProps={{
                                                        inputLabel: {
                                                            shrink: true,
                                                        }
                                                    }}
                                                    onChange={(e) => setNewAttendance({
                                                        ...newAttendance,
                                                        day: e.target.value
                                                    })}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormControl fullWidth>
                                                    <InputLabel id={`hour-select-label-${client.id}`}>Hour</InputLabel>
                                                    <Select
                                                        required
                                                        labelId={`hour-select-label-${client.id}`}
                                                        value={newAttendance.time}
                                                        onChange={(e) => handleHourChange(client.id, e.target.value as HoursEnum)}
                                                    >
                                                        {Object.values(HoursEnum).map((hour) => (
                                                            <MenuItem key={hour} value={hour}>
                                                                {hour}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={newAttendance.attended}
                                                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                                                        />
                                                    }
                                                    label="Attended"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>}

                            </TableBody>
                        </Table>
                    </div>

                    {
                        newAttendance &&
                        <Button sx={{marginTop: "1%"}} onClick={handleSaveAttendance} variant="contained">
                            Save
                        </Button>
                    }

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ClientAttendancesDialog;

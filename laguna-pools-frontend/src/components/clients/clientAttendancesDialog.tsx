import React, {useState} from 'react';
import {Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField} from '@mui/material';

interface Attendance {
    day: string;
    time: string;
    attended: boolean;
}

interface ClientAttendancesDialogProps {
    isModalOpen: boolean;
    modalCloseHandler: () => void;
}

const ClientAttendancesDialog: React.FC<ClientAttendancesDialogProps> = ({isModalOpen, modalCloseHandler}) => {
    const [attendances, setAttendances] = useState<Attendance[]>([
        {day: '2024-09-25', time: '10:00 AM', attended: true},
        {day: '2024-09-22', time: '2:00 PM', attended: false},
    ]);

    const [newAttendance, setNewAttendance] = useState<Attendance | null>(null);

    const handleCloseModal = () => {
        modalCloseHandler();
        setNewAttendance(null);
    };

    const handleAddNewRow = () => {
        setNewAttendance({day: '', time: '', attended: false});
    };

    const handleSaveAttendance = () => {
        if (newAttendance) {
            const updatedAttendances = [...attendances, newAttendance].sort(
                (a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()
            );
            setAttendances(updatedAttendances);
            setNewAttendance(null);
        }
    };

    const getRowStyle = (attended: boolean) => {
        if (attended) {
            return {backgroundColor: 'green', color: 'white'};
        } else {
            return {backgroundColor: 'red', color: 'white'};
        }
    };

    return (
        <div>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <div style={{padding: '20px', backgroundColor: 'white', margin: '10% auto', width: '50%'}}>
                    <Button onClick={handleAddNewRow} variant="outlined" style={{marginBottom: '20px'}}>
                        + Add Attendance
                    </Button>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Day</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Attended</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendances.map((attendance, index) => (
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
                                            label="Day"
                                            type="date"
                                            value={newAttendance.day}
                                            onChange={(e) => setNewAttendance({...newAttendance, day: e.target.value})}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            label="Time"
                                            type="time"
                                            value={newAttendance.time}
                                            onChange={(e) => setNewAttendance({...newAttendance, time: e.target.value})}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={handleSaveAttendance} variant="contained">
                                            Save
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Modal>
        </div>
    );
};

export default ClientAttendancesDialog;
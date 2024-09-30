import React, {useState} from "react";
import {
    Button,
    Checkbox,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TableCell,
    TableRow,
    TextField,
    Tooltip
} from "@mui/material";
import {Delete, Edit, Save} from "@mui/icons-material";
import {Client} from "../models/clientsModel";
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import {DayEnum} from "../../utils/enums/DayEnum";
import {HoursEnum} from "../../utils/enums/HoursEnum";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ClientAttendancesDialog from "./clientAttendancesDialog";
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";

interface ClientRowProps {
    client: Client;
    rowIndex: number;
    onDelete: (user: Client) => void;
    onUpdate: (updatedClient: Client) => void;
}

const ClientRow: React.FC<ClientRowProps> = ({client, onDelete, onUpdate, rowIndex}) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editableClient, setEditableClient] = useState<Client>(client);
    const [dayHourPairs, setDayHourPairs] = useState(editableClient.groups);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const modalCloseHandler = () => {
        setIsModalOpen(false);
    }

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        onUpdate(editableClient);
        authClient.request('clients', HttpMethod.POST, editableClient).then(() => {
            setEditMode(false);
        });
    };

    const handleInputChange = (field: keyof Client, value: string | boolean | number) => {
        setEditableClient({
            ...editableClient,
            [field]: value,
        });
    };


    const handleDayChange = (index: number, day: DayEnum) => {
        const updatedGroups = dayHourPairs.map((group, idx) =>
            idx === index ? {...group, day} : group
        );
        setDayHourPairs(updatedGroups);
        setEditableClient({...editableClient, groups: updatedGroups});
    };

    const handleHourChange = (index: number, hour: HoursEnum) => {
        const updatedGroups = dayHourPairs.map((group, idx) =>
            idx === index ? {...group, hour} : group
        );
        setDayHourPairs(updatedGroups);
        setEditableClient({...editableClient, groups: updatedGroups});
    };

    const handleRemoveGroup = (index: number) => {
        const updatedGroups = dayHourPairs.filter((_, idx) => idx !== index);
        setDayHourPairs(updatedGroups);
        setEditableClient({...editableClient, groups: updatedGroups});
    };

    const handleAddPair = () => {
        setDayHourPairs([...dayHourPairs, {id: 0, day: DayEnum.SUNDAY, hour: HoursEnum.HOUR_09}]);
        setEditableClient({
            ...editableClient,
            groups: [...dayHourPairs, {id: 0, day: DayEnum.SUNDAY, hour: HoursEnum.HOUR_09}]
        });
    };

    const handleDeleteClick = async () => {
        if (!window.confirm(`Are you sure you want to delete ${client.firstName} ${client.lastName}?`))
            return;

        const endpoint = `/clients?clientId=${client.id}`;
        await authClient.request(endpoint, HttpMethod.DELETE).then(r => {
            if (r.status === 200) {
                onDelete(client);
            }
        });
    };

    const isPastDate = (dateString: string | undefined) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return date < new Date();
    };

    const getExpirationFieldStyle = () => {
        if (!editableClient.expDate) {
            return {backgroundColor: 'red'}; // Empty field
        } else if (isPastDate(editableClient.expDate)) {
            return {backgroundColor: 'yellow'}; // Past date
        }
        return {};
    };

    const getDoctorCheckFieldStyle = () => {
        if (!editableClient.doctorCheckTill) {
            return {backgroundColor: 'red'}; // Empty field
        } else if (isPastDate(editableClient.doctorCheckTill)) {
            return {backgroundColor: 'yellow'}; // Past date
        }
        return {};
    };

    const getRowStyle = (condition: string) => {
        const styles = {
            expired: {
                background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.7), rgba(255, 100, 100, 0.7))',
                color: 'white',
            },
            warning: {
                background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.7), rgba(255, 255, 150, 0.7))',
                color: 'black',
            },
            valid: {
                background: 'linear-gradient(135deg, rgba(100, 255, 100, 0.7), rgba(150, 255, 150, 0.7))',
                color: 'black',
            },
        };

        const commonStyle = {
            borderRadius: '8px',
            padding: '8px',
            marginBottom: 2,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        };

        if (condition === 'expired') {
            return {...styles.expired, ...commonStyle};
        } else if (condition === 'warning') {
            return {...styles.warning, ...commonStyle};
        } else {
            return {...styles.valid, ...commonStyle};
        }
    };

    const getExpirationDateCondition = () => {
        if (!client.expDate) {
            return 'expired';
        } else if (isPastDate(client.expDate)) {
            return 'warning';
        }
        return 'valid';
    };

    const getDoctorCheckCondition = () => {
        if (!client.doctorCheckTill) {
            return 'expired';
        } else if (isPastDate(client.doctorCheckTill)) {
            return 'warning';
        }
        return 'valid';
    };

    return (
        <>
            <TableRow
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                    },
                    transition: 'background-color 0.1s ease',
                }}
            >
                {editMode ? (
                    <>
                        <TableCell>{rowIndex}</TableCell>
                        <TableCell>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        sx={{marginBottom: 1}}
                                        label="First Name"
                                        value={editableClient.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        sx={{marginBottom: 1}}
                                        label="Last Name"
                                        value={editableClient.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        sx={{marginBottom: 1}}
                                        label="Birthday"
                                        type="date"
                                        value={editableClient.age}
                                        onChange={(e) => handleInputChange("age", e.target.value)}
                                        fullWidth
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        sx={{marginBottom: 1}}
                                        label="Phone Number"
                                        value={editableClient.phoneNumber}
                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        sx={{marginBottom: 1}}
                                        label="Parent"
                                        value={editableClient.parent}
                                        onChange={(e) => handleInputChange("parent", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </TableCell>

                        <TableCell>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        sx={{marginBottom: 1}}
                                        label="Expiration Date"
                                        type="date"
                                        value={editableClient.expDate}
                                        onChange={(e) => handleInputChange("expDate", e.target.value)}
                                        fullWidth
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            }
                                        }}
                                        InputProps={{
                                            style: getExpirationFieldStyle()
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        sx={{marginBottom: 1}}
                                        label="Doctor Check"
                                        type="date"
                                        value={editableClient.doctorCheckTill}
                                        onChange={(e) => handleInputChange("doctorCheckTill", e.target.value)}
                                        fullWidth
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            }
                                        }}
                                        InputProps={{
                                            style: getDoctorCheckFieldStyle()
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={12}>
                                    <strong>ID:</strong>
                                    <Checkbox
                                        id={`id-status-edit-mode-id-${editableClient.id}`}
                                        checked={editableClient.idStatus}
                                        onChange={(e) => handleInputChange("idStatus", e.target.checked)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <strong>Contract:</strong>
                                    <Checkbox
                                        id={`contract-status-edit-mode-id-${editableClient.id}`}
                                        checked={editableClient.contractStatus}
                                        onChange={(e) => handleInputChange("contractStatus", e.target.checked)}
                                    />
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell>
                            {dayHourPairs.map((group, index) => (
                                <div key={index}
                                     style={{
                                         display: 'flex',
                                         gap: '1rem',
                                         marginBottom: '1rem',
                                         marginTop: '1rem'
                                     }}>
                                    <FormControl
                                        id={`edit-client-day-id-${editableClient.id}`}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        <InputLabel id={`edit-day-select-label-${index}`}>Day</InputLabel>
                                        <Select
                                            labelId={`edit-day-select-label-${index}`}
                                            value={group.day || ""}
                                            onChange={(e) => handleDayChange(index, e.target.value as DayEnum)}
                                            label="Day"
                                        >
                                            {Object.values(DayEnum).map((day) => (
                                                <MenuItem key={day} value={day}>
                                                    {day}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        id={`edit-client-hour-id-${editableClient.id}`}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        <InputLabel id={`edit-hour-select-label-${index}`}>Hour</InputLabel>
                                        <Select
                                            labelId={`edit-hour-select-label-${index}`}
                                            value={group.hour || ""}
                                            onChange={(e) => handleHourChange(index, e.target.value as HoursEnum)}
                                            label="Hour"
                                        >
                                            {Object.values(HoursEnum).map((hour) => (
                                                <MenuItem key={hour} value={hour}>
                                                    {hour}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button onClick={() => handleRemoveGroup(index)} color="error">
                                        <ClearOutlinedIcon/>
                                    </Button>
                                </div>
                            ))}

                            <Button onClick={handleAddPair} color="primary">
                                <GroupAddOutlinedIcon/>
                            </Button>
                        </TableCell>


                        <TableCell>
                            <TextField
                                sx={{marginBottom: 1}}
                                label="Cost"
                                type="number"
                                value={editableClient.cost}
                                onChange={(e) => handleInputChange("cost", parseFloat(e.target.value))}
                                fullWidth
                            />
                        </TableCell>


                        <TableCell>
                            <TextField
                                sx={{marginBottom: 1}}
                                label="Notes"
                                value={editableClient.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                fullWidth
                            />
                        </TableCell>


                        <TableCell align="center">
                            <IconButton onClick={handleSaveClick}>
                                <Save/>
                            </IconButton>
                        </TableCell>
                    </>
                ) : (
                    <>
                        <TableCell>{rowIndex}</TableCell>
                        <TableCell>
                            <Grid container spacing={1} alignItems="flex-start">
                                <Grid item xs={6}>
                                    <strong>Name:</strong> {`${client.firstName} ${client.lastName}`}
                                </Grid>
                                <Grid item xs={6}>
                                    <strong>Birthday:</strong> {client.age}
                                </Grid>
                                <Grid item xs={6}>
                                    <strong>Phone:</strong> {client.phoneNumber}
                                </Grid>
                                <Grid item xs={6}>
                                    <strong>Parent:</strong> {client.parent}
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                <span style={getRowStyle(getExpirationDateCondition())}>
                                    <strong>Expiration Date:</strong>
                                    <span style={{marginLeft: 2}}>{client.expDate}</span>
                                </span>
                                </Grid>
                                <Grid item xs={12}>
                                <span style={getRowStyle(getDoctorCheckCondition())}>
                                    <strong>Doctor Check:</strong>
                                    <span style={{marginLeft: 2}}>{client.doctorCheckTill}</span>
                                </span>
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={12}>
                                    <strong>ID:</strong> {client.idStatus ? (
                                    <TaskAltOutlinedIcon color="success"
                                                         style={{verticalAlign: "middle", marginLeft: 1}}/>
                                ) : (
                                    <UnpublishedOutlinedIcon color="error"
                                                             style={{verticalAlign: "middle", marginLeft: 1}}/>
                                )}
                                </Grid>
                                <Grid item xs={12}>
                                    <strong>Contract:</strong> {client.contractStatus ? (
                                    <TaskAltOutlinedIcon color="success"
                                                         style={{verticalAlign: "middle", marginLeft: 1}}/>
                                ) : (
                                    <UnpublishedOutlinedIcon color="error"
                                                             style={{verticalAlign: "middle", marginLeft: 1}}/>
                                )}
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell>
                            {client.groups.map((group, index) => (
                                <span key={index}>
                                <strong>{`${group.day}:`}</strong> {`${group.hour}`} {index < client.groups.length - 1 && '; '}
                            </span>
                            ))}
                        </TableCell>
                        <TableCell>
                            {new Intl.NumberFormat('ka-GE', {
                                style: 'currency',
                                currency: 'GEL'
                            }).format(client.cost)}
                        </TableCell>
                        <TableCell>
                            <Tooltip title={client.notes} placement="top" arrow>
                                <div style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '150px'
                                }}>
                                    {client.notes}
                                </div>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="center" sx={{width: "160px"}}>
                            {!hovered ? <ManageAccountsOutlinedIcon/> : <>
                                <IconButton onClick={() => setIsModalOpen(true)}>
                                    <EditCalendarIcon/>
                                </IconButton>
                                <IconButton onClick={handleEditClick}>
                                    <Edit/>
                                </IconButton>
                                <IconButton onClick={handleDeleteClick} color="error">
                                    <Delete/>
                                </IconButton>
                            </>
                            }
                        </TableCell>
                    </>
                )}
            </TableRow>

            <ClientAttendancesDialog client={client}
                                     isModalOpen={isModalOpen} modalCloseHandler={modalCloseHandler}/>
        </>
    );
};

export default ClientRow;

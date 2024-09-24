import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
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
    TextField
} from "@mui/material";
import {Refresh} from "@mui/icons-material";
import ActiveUserRow from "./activeUserRow";
import {User} from "../../models/usersModel";
import {HttpMethod} from "../../../utils/httpMethodEnum";
import authClient from "../../../api/api";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import LoadingPage from "../../common/loadingPage";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ActiveUsersTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Set default to 10 rows per page
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [filterText, setFilterText] = useState<string>("");
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [lastAuthDateFrom, setLastAuthDateFrom] = useState<string>("");
    const [lastAuthDateTo, setLastAuthDateTo] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const [roles, setRoles] = useState<Array<{ targetId: number; targetName: string; targetDescription: string }>>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const fetchUsers = async () => {
        setLoading(true)
        try {

            const params: Record<string, any> = {
                pageKey: page,
                pageSize: rowsPerPage,
                userName: filterText,
                isLocked: isLocked,
                roles: selectedRoles.join(','),
            };

            if (lastAuthDateFrom) {
                params.lastAuthDateFrom = lastAuthDateFrom;
            }
            if (lastAuthDateTo) {
                params.lastAuthDateTo = lastAuthDateTo;
            }

            const queryString = new URLSearchParams(params).toString();
            const response = await authClient.request(`admin/active_users?${queryString}`, HttpMethod.GET);

            if (Array.isArray(response.data.content)) {
                setUsers(response.data.content);
                setCount(response.data.total);
            } else {
                setAlertMessage(`Fetched users are not an array: ${response.data}`);
                setAlertOpen(true);
                setUsers([]);
            }
            setLoading(false)
        } catch (error) {
            setAlertMessage(`Error fetching users: ${error}`);
            setAlertOpen(true);
        }
    };

    const fetchRolesList = async () => {
        try {
            const rolesData = await authClient.request('admin/list_roles', HttpMethod.GET);

            if (Array.isArray(rolesData.data)) {
                setRoles(rolesData.data);
            } else {
                setAlertMessage(`Fetched roles are not an array: ${rolesData.data}`);
                setAlertOpen(true);
                setRoles([]);
            }
        } catch (err) {
            setAlertMessage(`Failed to fetch roles: ${err}`);
            setAlertOpen(true);
        }
    };

    useEffect(() => {
        fetchRolesList().then(r => r);
    }, []);

    useEffect(() => {
        fetchUsers().then(r => r);
    }, [page, rowsPerPage, filterText, isLocked, lastAuthDateFrom, lastAuthDateTo, selectedRoles]);

    const handleLock = (lockUser: User) => {
        setUsers(users.map(user => (user.userId === lockUser.userId ? lockUser : user)));
    };

    const handleDelete = (userToDelete: User) => {
        setUsers(users.filter(user => user.userId !== userToDelete.userId));
    };

    const handleSaveEdit = (updatedUser: User) => {
        setUsers(users.map(user => (user.userId === updatedUser.userId ? updatedUser : user)));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilterText(value);
    };

    const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastAuthDateFrom(e.target.value);
    };

    const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastAuthDateTo(e.target.value);
    };

    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleToggleIsLocked = () => {
        setIsLocked(prev => !prev);
    };

    const handleRefresh = () => {
        fetchUsers().then(r => r);
    };

    const handleRoleChange = (event: SelectChangeEvent<typeof selectedRoles>) => {
        const {
            target: {value},
        } = event;
        setSelectedRoles(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClearAll = () => {
        setFilterText("");
        setIsLocked(false);
        setLastAuthDateFrom("");
        setLastAuthDateTo("");
        setSelectedRoles([]);
    };


    return (
        <Paper>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                marginLeft: 2
            }}>
                <TextField
                    label="Filter by username"
                    variant="outlined"
                    value={filterText}
                    onChange={handleFilterChange}
                    fullWidth
                    margin="normal"
                    sx={{flexGrow: 1, height: 64}}
                />
                <TextField
                    label="Last Auth Date From"
                    type="datetime-local"
                    variant="outlined"
                    value={lastAuthDateFrom}
                    onChange={handleDateFromChange}
                    margin="normal"
                    sx={{minWidth: 190, marginLeft: 2, height: 64}}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
                <TextField
                    label="Last Auth Date To"
                    type="datetime-local"
                    variant="outlined"
                    value={lastAuthDateTo}
                    onChange={handleDateToChange}
                    margin="normal"
                    sx={{minWidth: 190, marginLeft: 2, height: 64}}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
                <FormControl sx={{minWidth: 300, marginLeft: 2}}>
                    <InputLabel id="roles-select-label">Roles</InputLabel>
                    <Select
                        labelId="roles-select-label"
                        id="roles-select"
                        multiple
                        value={selectedRoles}
                        onChange={handleRoleChange}
                        input={<OutlinedInput label="როლები"/>}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.targetId} value={role.targetDescription}>
                                <Checkbox checked={selectedRoles.includes(role.targetDescription)}/>
                                <ListItemText primary={role.targetDescription}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={handleToggleIsLocked}
                    sx={{
                        paddingLeft: 3,
                        paddingRight: 3,
                        ml: 2,
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {isLocked ? <LockOutlinedIcon color="warning"/> : <LockOpenOutlinedIcon/>}
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    sx={{
                        paddingLeft: 3,
                        paddingRight: 3,
                        ml: 2,
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                    }}
                > <Refresh/>
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClearAll}
                    sx={{
                        paddingLeft: 3,
                        paddingRight: 3,
                        ml: 2,
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <ClearAllIcon/>
                </Button>

            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Last auth date</TableCell>
                            <TableCell>roles</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <LoadingPage label="Loading Data..."/>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, index) => {
                                const rowNumber = page * rowsPerPage + index + 1;
                                return (
                                    <ActiveUserRow
                                        key={user.userId}
                                        user={user}
                                        onLock={handleLock}
                                        onDelete={handleDelete}
                                        onSaveEdit={handleSaveEdit}
                                        rowIndex={rowNumber}
                                        roles={roles}
                                    />
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
            >
                <Alert onClose={handleCloseAlert} severity="error">
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default ActiveUsersTable;

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
import {User} from "../../models/admin/usersModel";
import {HttpMethod} from "../../../utils/enums/httpMethodEnum";
import authClient from "../../../api/api";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import LoadingPage from "../../common/loadingPage";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import {TargetView} from "../../models/admin/targetViewModel";
import {BranchModel} from "../../models/admin/branchModel";
import {fetchBranchesList, fetchRolesList} from "../../../utils/utils";

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

const COLUMNS = ["#", "Usernames", "Last Auth Dates", "Roles", "Branches", "Actions"]

const ActiveUsersTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [filterText, setFilterText] = useState<string>("");
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [inActiveUsers, setInActiveUsers] = useState<boolean>(false);
    const [lastAuthDateFrom, setLastAuthDateFrom] = useState<string>("");
    const [lastAuthDateTo, setLastAuthDateTo] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

    const [roles, setRoles] = useState<Array<TargetView>>([]);
    const [branches, setBranches] = useState<Array<BranchModel>>([]);

    useEffect(() => {
        fetchRolesList().then(r => setRoles(r));
        fetchBranchesList().then(r => setBranches(r));
    }, []);

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
                branches: selectedBranches.join(','),
            };

            if (lastAuthDateFrom) {
                params.lastAuthDateFrom = lastAuthDateFrom;
            }
            if (lastAuthDateTo) {
                params.lastAuthDateTo = lastAuthDateTo;
            }

            let url = `admin/search/active_users?`;
            if (inActiveUsers) {
                params.inActiveUsers = inActiveUsers ? 1 : 0;
                url = `admin/search/all_users?`;
            }
            const queryString = new URLSearchParams(params).toString();
            const response = await authClient.request(url + queryString, HttpMethod.GET);

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

    useEffect(() => {
        fetchUsers().then(r => r);
    }, [page, rowsPerPage, isLocked, inActiveUsers, lastAuthDateFrom, lastAuthDateTo, selectedRoles, selectedBranches]);

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

    const handleToggleInActiveUsers = () => {
        setInActiveUsers(prev => !prev);
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

    const handleBranchChange = (event: SelectChangeEvent<typeof selectedBranches>) => {
        const {
            target: {value},
        } = event;
        setSelectedBranches(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClearAll = () => {
        setFilterText("");
        setIsLocked(false);
        setInActiveUsers(false);
        setLastAuthDateFrom("");
        setLastAuthDateTo("");
        setSelectedRoles([]);
        setSelectedBranches([]);
    };


    return (
        <Paper>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                gap: 1,
                flexWrap: 'wrap'
            }}>
                <TextField
                    label="Filter by username"
                    variant="outlined"
                    value={filterText}
                    onChange={handleFilterChange}
                    margin="normal"
                    sx={{flexGrow: 5, height: 64}}
                />
                <TextField
                    label="Last Auth Date From"
                    type="datetime-local"
                    variant="outlined"
                    value={lastAuthDateFrom}
                    onChange={handleDateFromChange}
                    margin="normal"
                    sx={{flexGrow: 1, height: 64}}
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
                    sx={{flexGrow: 1, height: 64}}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
                <FormControl sx={{flexGrow: 20}}>
                    <InputLabel id="roles-select-label">Roles</InputLabel>
                    <Select
                        labelId="roles-select-label"
                        id="roles-select"
                        multiple
                        value={selectedRoles}
                        onChange={handleRoleChange}
                        input={<OutlinedInput id={"roles-select-label-input"} label="Roles"/>}
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
                <FormControl sx={{flexGrow: 20}}>
                    <InputLabel id="branches-select-label">Branches</InputLabel>
                    <Select
                        labelId="branches-select-label"
                        id="branches-select"
                        multiple
                        value={selectedBranches}
                        onChange={handleBranchChange}
                        input={<OutlinedInput id={"branches-select-label-input"} label="Branches"/>}
                        renderValue={(selected) => selected.join(', \n')}
                        MenuProps={MenuProps}
                    >
                        {branches.map((branch) => (
                            <MenuItem key={branch.id} value={branch.branchName}>
                                <Checkbox checked={selectedBranches.includes(branch.branchName)}/>
                                <ListItemText primary={branch.branchName}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={handleToggleIsLocked}
                    sx={{
                        flexGrow: 0,
                        display: "flex",
                        alignItems: "center",
                        height: "50px"
                    }}
                >
                    {isLocked ? <LockOutlinedIcon color="warning"/> : <LockOpenOutlinedIcon/>}
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleToggleInActiveUsers}
                    sx={{
                        flexGrow: 0,
                        display: "flex",
                        alignItems: "center",
                        height: "50px"
                    }}
                >
                    {inActiveUsers ? <PersonRemoveAlt1OutlinedIcon color="error"/> : <PersonRemoveAlt1OutlinedIcon/>}
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    sx={{
                        flexGrow: 0,
                        display: "flex",
                        alignItems: "center",
                        height: "50px"
                    }}
                >
                    <Refresh/>
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClearAll}
                    sx={{
                        flexGrow: 0,
                        display: "flex",
                        alignItems: "center",
                        height: "50px"
                    }}
                >
                    <PlaylistRemoveOutlinedIcon/>
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {COLUMNS.map((column) => (
                                <TableCell>{column}</TableCell>
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
                            users.map((user, index) => {
                                const rowNumber = page * rowsPerPage + index + 1;
                                return (
                                    <ActiveUserRow
                                        inActiveUsers={inActiveUsers}
                                        key={user.userId}
                                        user={user}
                                        onLock={handleLock}
                                        onDelete={handleDelete}
                                        onSaveEdit={handleSaveEdit}
                                        rowIndex={rowNumber}
                                        roles={roles}
                                        branches={branches}
                                    />
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                SelectProps={{
                    id: 'rows-per-page-select-active-users',
                    name: 'rowsPerPageActiveUsers',
                }}
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

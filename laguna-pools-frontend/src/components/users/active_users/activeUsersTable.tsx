import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Paper,
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

const ActiveUsersTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pageSize, setPageSize] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Set default to 10 rows per page
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [filterText, setFilterText] = useState<string>("");
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [lastAuthDateFrom, setLastAuthDateFrom] = useState<string>("");
    const [lastAuthDateTo, setLastAuthDateTo] = useState<string>("");

    const fetchUsers = async () => {
        try {

            const params: Record<string, any> = {
                pageKey: page,
                pageSize: rowsPerPage,
                userName: filterText,
                isLocked: isLocked,
            };

            // Include lastAuthDateFrom and lastAuthDateTo only if they are not null
            if (lastAuthDateFrom) {
                params.lastAuthDateFrom = lastAuthDateFrom;
            }
            if (lastAuthDateTo) {
                params.lastAuthDateTo = lastAuthDateTo;
            }

            const queryString = new URLSearchParams(params).toString();
            const response = await authClient.request(`admin/active_users?${queryString}`, HttpMethod.GET);

            if (Array.isArray(response.data.content)) {
                console.log(response.data);
                setUsers(response.data.content);
                setPageSize(response.data.total);
            } else {
                setAlertMessage(`Fetched users are not an array: ${response.data}`);
                setAlertOpen(true);
                setUsers([]);
            }
        } catch (error) {
            setAlertMessage(`Error fetching users: ${error}`);
            setAlertOpen(true);
        }
    };

    useEffect(() => {
        fetchUsers().then(r => r);
    }, [page, rowsPerPage]);

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

    const handlePageChange = (event: unknown, newPage: number) => {
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

    const handleClearAll = () => {
        setFilterText("");
        setIsLocked(false);
        setLastAuthDateFrom("");
        setLastAuthDateTo("");
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
                    sx={{flexGrow: 1}}
                />

                <TextField
                    label="Last Auth Date From"
                    type="datetime-local"
                    variant="outlined"
                    value={lastAuthDateFrom}
                    onChange={handleDateFromChange}
                    margin="normal"
                    sx={{width: 300, marginLeft: 2}}
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
                    sx={{width: 300, marginLeft: 2}}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />

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
                    startIcon={<Refresh/>}
                    onClick={handleRefresh}
                    variant="outlined"
                    sx={{
                        paddingLeft: 3,
                        paddingRight: 3,
                        ml: 2,
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    Refresh
                </Button>
                <Button
                    startIcon={<ClearAllIcon/>}
                    onClick={handleClearAll}
                    variant="outlined"
                    sx={{
                        paddingLeft: 3,
                        paddingRight: 3,
                        marginLeft: 2,
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    Clear
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Last auth date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
                            const rowNumber = page * rowsPerPage + index + 1; // Calculate row number
                            return (
                                <ActiveUserRow
                                    key={user.userId}
                                    user={user}
                                    onLock={handleLock}
                                    onDelete={handleDelete}
                                    onSaveEdit={handleSaveEdit}
                                    rowIndex={rowNumber}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={pageSize}
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

import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    IconButton,
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
import {FilterList} from "@mui/icons-material";
import UserRow from "./userRow";
import {User} from "../models/usersModel";
import {HttpMethod} from "../../utils/httpMethodEnum";
import authClient from "../../api/api";

const UsersTable: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    const searchParams = {
        pageKey: page,
        pageSize: rowsPerPage,
        userName: filterText,
        isLocked: false
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const queryString = new URLSearchParams(searchParams as any).toString();
                const response = await authClient.request(`admin/active_users?${queryString}`, HttpMethod.GET);

                console.log(response.data);

                if (Array.isArray(response.data)) {
                    setUsers(response.data);
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

        fetchUsers().then(r => r);
    }, [page, rowsPerPage, filterText]);

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

    return (
        <Paper>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2}}>
                <TextField
                    label="Filter by username"
                    variant="outlined"
                    value={filterText}
                    onChange={handleFilterChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <FilterList/>
                            </IconButton>
                        ),
                    }}
                    sx={{flexGrow: 1}}
                />
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User Id</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Last auth date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                            <UserRow
                                key={user.userId}
                                user={user}
                                onDelete={handleDelete}
                                onSaveEdit={handleSaveEdit} // Pass the save handler
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
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

export default UsersTable;

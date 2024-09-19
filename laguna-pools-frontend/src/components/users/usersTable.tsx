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
import {User} from "../models/usersModel"; // Import the User type
import {HttpMethod} from "../../utils/httpMethodEnum"; // Adjust path as needed
import authClient from "../../api/api"; // Adjust path as needed

const UsersTable: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]); // Initialize with fetched data or empty array
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    // Example of search model (adjust as needed)
    const searchParams = {
        pageKey: page,
        pageSize: rowsPerPage,
        // userId: null, // Set these as needed
        userName: filterText,
        // lastAuthDateFrom: null, // Set these as needed
        // lastAuthDateTo: null, // Set these as needed
        isLocked: false // Set these as needed
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const queryString = new URLSearchParams(searchParams as any).toString();
                const response = await authClient.request(`admin/active_users?${queryString}`, HttpMethod.GET);

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
    }, [page, rowsPerPage, filterText]); // Include dependencies that affect the fetch

    // Handle user deletion
    const handleDelete = (userToDelete: User) => {
        setUsers(users.filter(user => user.userId !== userToDelete.userId));
    };

    // Handle filter text change
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilterText(value);
    };

    // Handle page change
    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
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
                            <UserRow onDelete={handleDelete} key={user.userId} user={user}/>
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

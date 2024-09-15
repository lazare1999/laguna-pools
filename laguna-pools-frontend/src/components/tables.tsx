import React, {useState} from "react";
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from "@mui/material";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {FilterList} from "@mui/icons-material";
import UserRow from "./userRow";
import {initialUsers, User} from "../utils/mockUsers";
import AddUserDialog from "./addUserDialog";

const ClientsTable: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleDelete = (userToDelete: User) => {
        setUsers(users.filter(user => user !== userToDelete));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilterText(value);

        const filtered = initialUsers.filter((user) =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(value)
        );
        setUsers(filtered);
    };

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAddUser = (newUser: User) => {
        setUsers([...users, newUser]);
    };

    return (
        <Paper>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2}}>
                <TextField
                    label="Filter by name"
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    startIcon={<PersonAddAltIcon/>}
                    sx={{
                        ml: 2,
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    New User
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Expiration Date</TableCell>
                            <TableCell>Attendance</TableCell>
                            <TableCell>Plan</TableCell>
                            <TableCell>Sessions</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                            <UserRow onDelete={handleDelete} key={index} user={user}/>
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
            <AddUserDialog open={openDialog} onClose={handleCloseDialog} onAddUser={handleAddUser}/>
        </Paper>
    );
};

export default ClientsTable;

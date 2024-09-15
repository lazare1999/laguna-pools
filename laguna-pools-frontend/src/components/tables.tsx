import React, {useState} from "react";
import {
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
import {FilterList} from "@mui/icons-material";
import UserRow from "./userRow";
import {initialUsers, User} from "../utils/mockUsers";

const ClientsTable: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

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

    return (
        <Paper>
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
            />
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
        </Paper>
    );
};

export default ClientsTable;
import React, {useState} from "react";
import {
    Box,
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
import {initialUsers, MockUser} from "../../utils/mockUsers";

const UsersTable: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [users, setUsers] = useState<MockUser[]>(initialUsers);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    const handleDelete = (userToDelete: MockUser) => {
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
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Last Joined Date</TableCell>
                            <TableCell>Role</TableCell>
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

export default UsersTable;

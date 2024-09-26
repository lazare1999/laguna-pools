import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
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
    TextField,
} from "@mui/material";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {FilterList} from "@mui/icons-material";
import ClientRow from "./clientRow";
import AddClientDialog from "./addClientDialog";
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/httpMethodEnum";
import {Client} from "../models/clientsModel";
import LoadingPage from "../common/loadingPage";

const ClientsTable: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [clients, setClients] = useState<Client[]>([]);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    const fetchClients = async () => {
        setLoading(true)
        try {
            const params: Record<string, any> = {
                pageKey: page,
                pageSize: rowsPerPage,
                clientName: filterText,
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await authClient.request(`clients/all?${queryString}`, HttpMethod.GET);

            if (Array.isArray(response.data.content)) {
                setClients(response.data.content);
                setCount(response.data.total);
            } else {
                setAlertMessage(`Fetched clients are not an array: ${response.data}`);
                setAlertOpen(true);
                setClients([]);
            }
            setLoading(false)
        } catch (error) {
            setAlertMessage(`Error fetching clients: ${error}`);
            setAlertOpen(true);
        }
    };


    useEffect(() => {
        fetchClients().then(r => r);
    }, [page, rowsPerPage, filterText]);

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleDelete = (userToDelete: Client) => {
        setClients(clients.filter(client => client !== userToDelete));
    };

    const handleUpdate = (updatedClient: Client) => {
        setClients(clients.map(client => (client.id === updatedClient.id ? updatedClient : client)));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilterText(value);

        const filtered = clients.filter((client) =>
            `${client.firstName} ${client.lastName}`.toLowerCase().includes(value)
        );
        setClients(filtered);
    };

    const handlePageChange = (_: unknown, newPage: number) => {
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

    const handleAddClient = (newUser: Client) => {
        setClients([...clients, newUser]);
    };

    return (
        <Paper>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2}}>
                <TextField
                    id={"clients-table-search-id"}
                    name={"clients-table-search-name"}
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
                    sx={{flexGrow: 1, height: 64}}
                />
                <Button
                    id={"clients-table-add-client-id"}
                    name={"clients-table-add-client-name"}
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    sx={{
                        ml: 2,
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <PersonAddAltIcon/>
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Dates</TableCell>
                            <TableCell>Statuses</TableCell>
                            <TableCell>Groups</TableCell>
                            <TableCell>Cost</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <LoadingPage label="Loading Data..."/>
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client, index) => {
                                const rowNumber = page * rowsPerPage + index + 1;
                                return (
                                    <ClientRow
                                        onUpdate={handleUpdate}
                                        key={client.id}
                                        client={client}
                                        onDelete={handleDelete}
                                        rowIndex={rowNumber}
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
                    id: 'rows-per-clients-page-select',
                    name: 'rowsClientsPerPage',
                }}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <AddClientDialog open={openDialog} onClose={handleCloseDialog} onAddClient={handleAddClient}/>
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

export default ClientsTable;

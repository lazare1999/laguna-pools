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
    TextField,
} from "@mui/material";
import ClientRow from "./clientRow";
import AddClientDialog from "./addClientDialog";
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/httpMethodEnum";
import {Client} from "../models/clientsModel";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {Refresh} from "@mui/icons-material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterDialog from "./filterDialog";
import {ClientFilters, defaultClientFilters, defaultDialogFilters, DialogFilters} from "../models/clientFilterModels";
import LoadingPage from "../common/loadingPage";
import {Toast} from "../../utils/alertsUtils";

const COLUMNS = ["#", "Client", "Dates", "Statuses", "Groups", "Cost", "Notes", "Actions"];

const ClientsTable: React.FC = () => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [filters, setFilters] = useState<ClientFilters>(defaultClientFilters);
    const [dialogFilters, setDialogFilters] = useState<DialogFilters>(defaultDialogFilters);

    const [clients, setClients] = useState<Client[]>([]);
    const [count, setCount] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false); // State for filter dialog
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const openToastHandler = () => {
        setToastOpen(true);
    }

    const toastMessageHandler = (message: string) => {
        setToastMessage(message);
    }

    const fetchClients = async () => {
        setLoading(true);
        try {
            const params = {
                pageKey: page.toString(),
                pageSize: rowsPerPage.toString(),
                ...filters,
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
        } catch (error) {
            setAlertMessage(`Error fetching clients: ${error}`);
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients().then(r => r);
    }, [page, rowsPerPage, filters]);

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleDelete = (userToDelete: Client) => {
        setClients(clients.filter(client => client !== userToDelete));
    };

    const handleUpdate = (updatedClient: Client) => {
        setClients(clients.map(client => (client.id === updatedClient.id ? updatedClient : client)));
    };

    const handleFilterChange = (key: keyof typeof filters) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFilters({...filters, [key]: e.target.value});
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

    const handleRefresh = () => {
        fetchClients().then(r => r);
    };

    const handleClearAll = () => {
        setFilters(defaultClientFilters);
        setDialogFilters(defaultDialogFilters);
    };

    const handleOpenFilterDialog = () => {
        setOpenFilterDialog(true);
    };

    const handleCloseFilterDialog = () => {
        setOpenFilterDialog(false);
    };

    const handleApplyFilters = (newFilters: any) => { // Adjust type as needed
        setFilters(newFilters);
    };

    return (
        <>
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
                        label="First Name"
                        variant="outlined"
                        value={filters.name}
                        onChange={handleFilterChange("name")}
                        margin="normal"
                        sx={{flexGrow: 5, height: 64}}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={filters.lastName}
                        onChange={handleFilterChange("lastName")}
                        margin="normal"
                        sx={{flexGrow: 5, height: 64}}
                    />
                    <Button
                        id={"clients-table-add-client-id"}
                        variant="outlined"
                        onClick={handleOpenDialog}
                        sx={{
                            flexGrow: 0,
                            display: "flex",
                            alignItems: "center",
                            height: "50px"
                        }}
                    >
                        <PersonAddAltIcon/>
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
                        onClick={handleOpenFilterDialog}
                        sx={{
                            flexGrow: 0,
                            display: "flex",
                            alignItems: "center",
                            height: "50px"
                        }}
                    >
                        <FilterAltOutlinedIcon/>
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
                        <ClearAllIcon/>
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {COLUMNS.map((column) => (
                                    column === "Actions" ? <TableCell align="center" key={column}>{column}</TableCell> :
                                        <TableCell key={column}>{column}</TableCell>
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
                                clients.map((client, index) => (
                                    <ClientRow
                                        key={client.id}
                                        client={client}
                                        onDelete={handleDelete}
                                        onUpdate={handleUpdate}
                                        rowIndex={index + 1 + page * rowsPerPage}
                                    />
                                ))
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
                <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity="error">
                        {alertMessage}
                    </Alert>
                </Snackbar>
                <AddClientDialog open={openDialog} onClose={handleCloseDialog} onAddClient={handleAddClient}
                                 openToastHandler={openToastHandler} toastMessageHandler={toastMessageHandler}/>
                <FilterDialog
                    open={openFilterDialog}
                    onClose={handleCloseFilterDialog}
                    filters={dialogFilters}
                    setFilters={setDialogFilters}
                    onApplyFilters={handleApplyFilters}
                />
            </Paper>

            <Toast
                open={toastOpen}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
                options={{autoHideDuration: 3000}}
            />
        </>
    );
};

export default ClientsTable;

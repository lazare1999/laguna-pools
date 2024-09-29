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
    TextField,
} from "@mui/material";
import ClientRow from "./clientRow";
import AddClientDialog from "./addClientDialog";
import {Client} from "../models/clientsModel";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {Refresh} from "@mui/icons-material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterDialog from "./filterDialog";
import {ClientFilters, defaultClientFilters, defaultDialogFilters, DialogFilters} from "../models/clientFilterModels";
import LoadingPage from "../common/loadingPage";
import {Toast} from "../../utils/alertsUtils";
import {BranchModel} from "../models/branchModel";
import {fetchBranchesList} from "../../utils/utils";
import {UserApiService} from "../../api/userApiService";
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import {FILTER_BUTTON_STYLES} from "../../utils/constants";
import {getAllFilteredClientsGrid, getClients} from "./utils";
import {exportTableToExcel} from "../../utils/exportExcel";

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

    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [branches, setBranches] = useState<Array<BranchModel>>([]);

    useEffect(() => {
        UserApiService.getRoles().then(r => {
            setUserRoles(r.data.roles);
        }).catch(err => console.error(err));
        fetchBranchesList().then(r => setBranches(r));
    }, []);

    const openToastHandler = () => {
        setToastOpen(true);
    }

    const toastMessageHandler = (message: string) => {
        setToastMessage(message);
    }

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await getClients(page.toString(), rowsPerPage.toString(), filters);

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

    const hasRole = (role: string) => {
        return userRoles.includes(role);
    };

    const handleBranchChange = (event: SelectChangeEvent<string[]>) => {
        const {value} = event.target;
        setFilters({
            ...filters,
            branches: typeof value === "string" ? value.split(",") : value,
        });
    };

    const exportClients = async () => {
        const result = await getAllFilteredClientsGrid(filters);
        exportTableToExcel(result, "clients" + new Date())
    }

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
                    {hasRole("ROLE_LAGUNA_ADMIN") &&
                        <FormControl sx={{flexGrow: 20}}>
                            <InputLabel id="branches-select-label-client">Branches</InputLabel>
                            <Select
                                labelId="branches-select-label-client"
                                id="branches-select-client"
                                multiple
                                value={filters.branches}
                                onChange={handleBranchChange}
                                input={<OutlinedInput id={"branches-select-label-input"} label="Branches"/>}
                                renderValue={(selected) => selected.join(', \n')}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {branches.map((branch) => (
                                    <MenuItem key={branch.id} value={branch.id}>
                                        <Checkbox checked={filters.branches.includes(String(branch.id))}/>
                                        <ListItemText primary={branch.branchName}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    }
                    <Button
                        id={"clients-table-add-client-id"}
                        variant="outlined"
                        onClick={handleOpenDialog}
                        sx={FILTER_BUTTON_STYLES}
                    >
                        <PersonAddAltIcon/>
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleRefresh}
                        sx={FILTER_BUTTON_STYLES}
                    >
                        <Refresh/>
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleOpenFilterDialog}
                        sx={FILTER_BUTTON_STYLES}
                    >
                        <FilterAltOutlinedIcon/>
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={exportClients}
                        sx={FILTER_BUTTON_STYLES}
                    >
                        <DownloadOutlinedIcon/>
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClearAll}
                        sx={FILTER_BUTTON_STYLES}
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

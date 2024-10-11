import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from "@mui/material";
import BranchSelector from "../clients/branchSelector";
import {UserApiService} from "../../api/userApiService";
import {AccountingFilters, defaultAccountingFilters} from "../models/accounting/accountingFilterModel";
import {Refresh} from "@mui/icons-material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import LoadingPage from "../common/loadingPage";
import AccountingPageGraphs from "./accountingPageGraphs";
import {format} from "date-fns";
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import {AlertDialog, Toast} from "../../utils/alertsUtils";
import {AccountingClientModel} from "../models/accounting/accountingClientModel";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const COLUMNS = ["#", "Amount", "Date", "Type", "Client", "Note"];


const filterFields = [
    {label: "Day From", key: "dayFrom", type: "datetime-local"},
    {label: "Day To", key: "dayTo", type: "datetime-local"},
    {label: "Name", key: "name", type: "text"},
    {label: "Lastname", key: "lastname", type: "text"},
];

const AccountingPage: React.FC = () => {
    const [accounting, setAccounting] = useState<AccountingClientModel[]>([]);
    const [filters, setFilters] = useState<AccountingFilters>(defaultAccountingFilters);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [accountingLoading, setAccountingLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [count, setCount] = useState<number>(0);
    const [openGraphModal, setOpenGraphModal] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    useEffect(() => {
        fetchData().then(r => r);
    }, [page, rowsPerPage]);

    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        UserApiService.getRoles().then(r => {
            setUserRoles(r.data.roles);
        }).catch(err => console.error(err));
    }, []);

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

    const fetchData = async () => {
        setAccountingLoading(true);
        try {
            const params: Record<string, any> = {
                pageKey: page,
                pageSize: rowsPerPage,
                ...filters
            };
            const queryString = new URLSearchParams(params as any).toString();
            const response = await authClient.request(`accounting?${queryString}`, HttpMethod.GET);

            if (Array.isArray(response.data.content)) {
                setAccounting(response.data.content);
                setCount(response.data.total);
            } else {
                setAlertMessage('Network response was not ok');
                setAlertOpen(true);
            }
        } catch (error) {
            setAlertMessage(`Error fetching data: ${error}`);
            setAlertOpen(true);
        }
        setAccountingLoading(false);
    };

    const handleRefresh = () => {
        fetchData().then(r => r);
    };

    const handleClearAll = () => {
        setFilters(defaultAccountingFilters);
    };

    const handleChange =
        (key: keyof AccountingFilters) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setFilters({...filters, [key]: event.target.value});
            };

    const handleOpenGraphModal = () => {
        setOpenGraphModal(true);
    };

    const handleCloseGraphModal = () => {
        setOpenGraphModal(false);
    };

    const handleCalculateTodayIncome = async () => {
        try {
            const params: Record<string, any> = {
                branches: filters.branches
            };
            const queryString = new URLSearchParams(params as any).toString();
            const response = await authClient.request(`accounting/calc_income?${queryString}`, HttpMethod.GET);

            if (response.status === 200) {
                setToastMessage(response.data);
                setToastOpen(true);
            }
        } catch (error) {
            setAlertMessage(`Error fetching data: ${error}`);
            setAlertOpen(true);
        }
    };

    return (
        <>
            {accountingLoading ? <LoadingPage label={"Loading Table Data..."}/> :
                <div style={{padding: '20px'}}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 2,
                        gap: 1,
                        flexWrap: 'wrap'
                    }}>
                        {filterFields.map(({label, key, type}) => (
                            <TextField
                                label={label}
                                type={type}
                                variant="outlined"
                                value={filters[key as keyof AccountingFilters]}
                                onChange={handleChange(key as keyof AccountingFilters)}

                                margin="normal"
                                sx={{flexGrow: 1, height: 64}}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    }
                                }}
                            />
                        ))}

                        {hasRole("ROLE_LAGUNA_ADMIN") &&
                            <FormControl sx={{flexGrow: 20}}>
                                <InputLabel id="branches-select-label-accounting">Branches</InputLabel>
                                <BranchSelector id={"branches-select-label-accounting"}
                                                labelId={"branches-select-label-accounting-label-id"}
                                                filters={filters} handleBranchChange={handleBranchChange}/>
                            </FormControl>
                        }

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
                            <ClearAllIcon/>
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleOpenGraphModal}
                            sx={{
                                flexGrow: 0,
                                display: "flex",
                                alignItems: "center",
                                height: "50px"
                            }}
                        >
                            <EqualizerOutlinedIcon/>
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleCalculateTodayIncome}
                            sx={{
                                flexGrow: 0,
                                display: "flex",
                                alignItems: "center",
                                height: "50px"
                            }}
                        >
                            <AccessTimeOutlinedIcon/>
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {COLUMNS.map((column) => (
                                        column === "Actions" ?
                                            <TableCell align="center" key={column}>{column}</TableCell> :
                                            <TableCell key={column}>{column}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    accounting.map((a, index) => {
                                        const rowNumber = page * rowsPerPage + index + 1;
                                        return (
                                            <TableRow key={a.id} style={{cursor: 'pointer'}}>
                                                <TableCell>{rowNumber}</TableCell>
                                                <TableCell>{a.amount}</TableCell>
                                                <TableCell>{format(new Date(a.date), 'MMMM dd, yyyy')}</TableCell>
                                                <TableCell>{a.type}</TableCell>
                                                <TableCell>{`${a.client.firstName} ${a.client.lastName}`}</TableCell>
                                                <TableCell>{a.note}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
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

                    <Dialog
                        open={openGraphModal}
                        onClose={handleCloseGraphModal}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>Finances Graphs</DialogTitle>
                        <AccountingPageGraphs/>
                    </Dialog>
                    <AlertDialog
                        open={alertOpen}
                        title="Error"
                        message={alertMessage}
                        onClose={() => setAlertOpen(false)}
                    />
                    <Toast
                        open={toastOpen}
                        message={toastMessage}
                        onClose={() => setToastOpen(false)}
                        options={{autoHideDuration: 6000}}
                    />
                </div>
            }
        </>
    );
};

export default AccountingPage;

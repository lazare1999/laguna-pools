import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
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
    TextField
} from "@mui/material";
import BranchSelector from "../clients/branchSelector";
import {UserApiService} from "../../api/userApiService";
import {AccountingFilters, defaultAccountingFilters} from "../models/accounting/accountingFilterModel";
import {Refresh} from "@mui/icons-material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import LoadingPage from "../common/loadingPage";
import AccountingPageGraphs from "./accountingPageGraphs";
import {format} from "date-fns";
import {AccountingModel, defaultAccountingModel} from "../models/accounting/accountingModel";

const COLUMNS = ["#", "Amount", "Date", "Type", "Client"];

const AccountingPage: React.FC = () => {

    const [accounting, setAccounting] = useState<AccountingModel>(defaultAccountingModel);

    const [filters, setFilters] = useState<AccountingFilters>(defaultAccountingFilters);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [accountingLoading, setAccountingLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [count, setCount] = useState<number>(0);


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
    }

    const fetchData = async () => {
        setAccountingLoading(true);

        setCount(0)
        setAccounting(defaultAccountingModel);

        setAccountingLoading(false);
    };

    const handleRefresh = () => {
        fetchData().then(r => r);
    };

    const handleClearAll = () => {
        setFilters(defaultAccountingFilters);
    };

    const handleFilterChange = (key: keyof typeof filters) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFilters({...filters, [key]: e.target.value});
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
                        <TextField
                            label="Date From"
                            type="date"
                            variant="outlined"
                            value={filters.dayFrom}
                            onChange={handleFilterChange("dayFrom")}
                            margin="normal"
                            sx={{flexGrow: 1, height: 64}}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                }
                            }}
                        />
                        <TextField
                            label="Date To"
                            type="date"
                            variant="outlined"
                            value={filters.dayTo}
                            onChange={handleFilterChange("dayTo")}
                            margin="normal"
                            sx={{flexGrow: 1, height: 64}}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                }
                            }}
                        />

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
                    </Box>
                    <AccountingPageGraphs data={accounting.graphData}/>
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
                                    accounting.accountingClient.map((a, index) => {
                                        const rowNumber = page * rowsPerPage + index + 1;
                                        return (
                                            <TableRow style={{cursor: 'pointer'}}>
                                                <TableCell>{rowNumber}</TableCell>
                                                <TableCell>{a.amount}</TableCell>
                                                <TableCell>{format(new Date(a.date), 'MMMM dd, yyyy')}</TableCell>
                                                <TableCell>{a.type}</TableCell>
                                                <TableCell>{`${a.client.firstName} ${a.client.lastName}`}</TableCell>
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
                </div>
            }
        </>
    );
};

export default AccountingPage;

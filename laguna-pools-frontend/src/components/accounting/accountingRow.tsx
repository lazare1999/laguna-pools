import React, {useState} from 'react';
import {IconButton, TableCell, TableRow} from '@mui/material';
import {format} from 'date-fns';
import {AccountingClientModel} from "../models/accounting/accountingClientModel";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import GeneratePDF from "./generatePDF";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {Delete} from "@mui/icons-material";
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";

interface AccountingRowProps {
    rowNumber: number;
    accountingData: AccountingClientModel
    userRoles: string[];
    onDelete: (accounting: AccountingClientModel) => void;
}

const AccountingRow: React.FC<AccountingRowProps> = ({
                                                         rowNumber,
                                                         accountingData,
                                                         userRoles,
                                                         onDelete
                                                     }) => {

    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const hasRole = (role: string) => {
        return userRoles.includes(role);
    };


    const handleDeleteClick = async () => {
        if (!window.confirm(`Are you sure you want to delete order?`))
            return;

        try {
            const endpoint = `/accounting?id=${accountingData.id}`;
            await authClient.request(endpoint, HttpMethod.DELETE).then(r => {
                if (r.status === 200) {
                    onDelete(accountingData);
                }
            });
        } catch (error) {
            throw error;
        }
    };

    return (
        <TableRow
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            key={rowNumber}
            style={{cursor: 'pointer'}}
        >
            <TableCell>{rowNumber}</TableCell>
            <TableCell>{accountingData.amount}</TableCell>
            <TableCell>{format(new Date(accountingData.date), 'MMMM dd, yyyy')}</TableCell>
            <TableCell>{accountingData.type}</TableCell>
            <TableCell>
                {accountingData.client ? (`${accountingData.client.firstName} ${accountingData.client.lastName}`) : ""}
            </TableCell>
            <TableCell>{accountingData.note}</TableCell>
            <TableCell align="center" sx={{width: "160px", height: "37px"}}>
                {!hovered ? <ManageAccountsOutlinedIcon/> : <>
                    <IconButton onClick={() => GeneratePDF(accountingData)}>
                        <PictureAsPdfIcon fontSize="small" color={"error"}/>
                    </IconButton>
                    {hasRole("ROLE_LAGUNA_ADMIN") &&
                        <IconButton onClick={handleDeleteClick} color="error">
                            <Delete/>
                        </IconButton>
                    }
                </>
                }
            </TableCell>
        </TableRow>
    );
};

export default AccountingRow;

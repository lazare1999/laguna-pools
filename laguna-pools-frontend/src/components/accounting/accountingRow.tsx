import React, {useState} from 'react';
import {IconButton, TableCell, TableRow} from '@mui/material';
import {format} from 'date-fns';
import {AccountingClientModel} from "../models/accounting/accountingClientModel";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import GeneratePDF from "./generatePDF";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface AccountingRowProps {
    rowNumber: number;
    accountingData: AccountingClientModel

}

const AccountingRow: React.FC<AccountingRowProps> = ({
                                                         rowNumber,
                                                         accountingData
                                                     }) => {

    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
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
            <TableCell>{`${accountingData.client.firstName} ${accountingData.client.lastName}`}</TableCell>
            <TableCell>{accountingData.note}</TableCell>
            <TableCell align="center" sx={{width: "160px"}}>
                {!hovered ? <ManageAccountsOutlinedIcon/> : <>
                    <IconButton onClick={() => GeneratePDF(accountingData)}>
                        <PictureAsPdfIcon color={"error"}/>
                    </IconButton>
                </>
                }
            </TableCell>
        </TableRow>
    );
};

export default AccountingRow;

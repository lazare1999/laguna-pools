import React, {useState} from "react";
import {Client} from "../models/clients/clientsModel";
import {
    Box,
    Dialog,
    DialogContent,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import ForwardIcon from '@mui/icons-material/Forward';
import ApiService from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import {TransactionEnum} from "../../utils/enums/TransactionEnum";
import CustomDialogTitle from "../common/lagunaDialog";

interface FinancesDialogProps {
    client: Client;
    isModalOpen: boolean;
    modalCloseHandler: () => void;
}

const FinancesDialog: React.FC<FinancesDialogProps> = ({client, isModalOpen, modalCloseHandler}) => {
    const [type, setType] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState("");

    const [amountError, setAmountError] = useState(false);
    const [typeError, setTypeError] = useState(false);

    const handleNoteChange = (value: string) => {
        setNote(value);
    };

    const handleAmountChange = (value: number) => {
        setAmount(value);
        setAmountError(false);
    };

    const onEnterClick = () => {
        let hasError = false;

        if (amount <= 0) {
            setAmountError(true);
            hasError = true;
        }

        if (!type) {
            setTypeError(true);
            hasError = true;
        }

        if (hasError) {
            return;
        }

        ApiService.request("accounting", HttpMethod.POST,
            {
                clientId: client.id,
                amount: amount,
                type: type,
                note: note
            }
        )
            .then(() => modalCloseHandler())
            .catch(err => console.log(err));
    };

    return (
        <Dialog open={isModalOpen} onClose={modalCloseHandler} fullWidth maxWidth="sm">
            <CustomDialogTitle>Add Transaction</CustomDialogTitle>
            <DialogContent sx={{padding: '24px'}}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        '& > *': {
                            flexGrow: 1,
                        },
                    }}
                >
                    <TextField
                        value={amount}
                        type="number"
                        margin="normal"
                        label="Amount"
                        variant="outlined"
                        error={amountError}
                        onChange={event => handleAmountChange(Number(event.target.value))}
                        fullWidth
                        helperText={amountError ? "required" : ""}
                    />

                    <FormControl sx={{minWidth: 200}} margin="normal" error={typeError}>
                        <InputLabel id="select-label">Option</InputLabel>
                        <Select
                            labelId="select-label"
                            value={type}
                            onChange={e => {
                                setType(e.target.value as TransactionEnum);
                                setTypeError(false);
                            }}
                            label="Option"
                        >
                            <MenuItem value={TransactionEnum.CASH}>Cash</MenuItem>
                            <MenuItem value={TransactionEnum.CARD}>Card</MenuItem>
                        </Select>
                        {typeError && <FormHelperText>required</FormHelperText>}
                    </FormControl>

                    <TextField
                        label="Note"
                        variant="outlined"
                        margin="normal"
                        value={note}
                        onChange={event => handleNoteChange(event.target.value)}
                        fullWidth
                    />

                    <IconButton onClick={onEnterClick} sx={{color: 'primary.main', marginTop: 1}}>
                        <ForwardIcon fontSize="large"/>
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FinancesDialog;

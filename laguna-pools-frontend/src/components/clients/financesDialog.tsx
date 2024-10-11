import React, {useState} from "react";
import {Client} from "../models/clients/clientsModel";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import ForwardIcon from '@mui/icons-material/Forward';
import ApiService from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";

interface FinancesDialogProps {
    client: Client;
    isModalOpen: boolean;
    modalCloseHandler: () => void;
}

const FinancesDialog: React.FC<FinancesDialogProps> = ({client, isModalOpen, modalCloseHandler}) => {
    const [type, setType] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState("");

    const handleNoteChange = (value: string) => {
        setNote(value);
    };

    const handleAmountChange = (value: number) => {
        setAmount(value);
    }

    const onEnterClick = () => {
        ApiService.request("accounting", HttpMethod.POST,
            {
                clientId: client.id,
                amount: amount,
                type: type,
                note: note
            }
        ).then(() => modalCloseHandler()).catch(err => console.log(err));
    }

    return (
        <Dialog open={isModalOpen} onClose={modalCloseHandler} fullWidth>
            <DialogTitle>Add transaction</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        '& > *': {
                            margin: '5px',
                        },
                    }}
                >
                    <TextField value={amount} type="number" label="Amount" variant="outlined"
                               onChange={event => handleAmountChange(Number(event.target.value))}/>

                    <FormControl sx={{minWidth: 200}}>
                        <InputLabel id="select-label">Option</InputLabel>
                        <Select
                            labelId="select-label"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            label="Option"
                        >
                            <MenuItem value={"Cash"}>Cash</MenuItem>
                            <MenuItem value={"Cart"}>Cart</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField label="Note" variant="outlined" value={note}
                               onChange={event => handleNoteChange(event.target.value)}/>

                    <IconButton onClick={onEnterClick}>
                        <ForwardIcon fontSize="large"/>
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FinancesDialog;
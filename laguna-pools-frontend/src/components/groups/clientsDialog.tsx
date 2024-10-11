import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import authClient from '../../api/api';
import {getCurrentTime, getString} from "./utils";
import LoadingPage from "../common/loadingPage";
import CustomDialogTitle from "../common/lagunaDialog";

interface Client {
    id: number;
    firstName: string;
    lastName: string;
}

interface ClientModalProps {
    clients: Client[];
    open: boolean;
    handleClose: () => void;
    shouldSave: boolean;
    loading: boolean;
}

const ClientModal: React.FC<ClientModalProps> = ({clients, open, handleClose, shouldSave, loading}) => {
    const [checkedClients, setCheckedClients] = useState<number[]>([]);

    useEffect(() => {
        if (open) {
            setCheckedClients(clients.map(client => client.id));
        }
    }, [clients, open]);


    const handleToggle = (id: number) => {
        const currentIndex = checkedClients.indexOf(id);
        const newChecked = [...checkedClients];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedClients(newChecked);
    };

    const handleRemove = (id: number) => {
        setCheckedClients((prevChecked) => prevChecked.filter((clientId) => clientId !== id));
    };

    const handleSave = async () => {

        const checkedClientIds = [...checkedClients];
        const uncheckedClientIds = clients
            .filter(client => !checkedClientIds.includes(client.id))
            .map(client => client.id);

        try {
            const time = getString(getCurrentTime());
            if (checkedClientIds.length > 0) {
                await authClient.request('attendances/clients/add', HttpMethod.POST, {
                    clientIds: checkedClientIds,
                    time: time,
                    attended: true,
                });
            }

            if (uncheckedClientIds.length > 0) {
                await authClient.request('attendances/clients/add', HttpMethod.POST, {
                    clientIds: uncheckedClientIds,
                    time: time,
                    attended: false,
                });
            }

            handleClose();
        } catch (error) {
            console.error('Error saving attendances:', error);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <CustomDialogTitle>Select Clients</CustomDialogTitle>
            <DialogContent>
                <Grid style={{height: '40%', overflowY: 'auto', width: '100%'}}>
                    <List>
                        {loading ? (
                            <ListItem>
                                <LoadingPage label="Loading Data..."/>
                            </ListItem>
                        ) : (
                            <>
                                {clients.map((client) => (
                                    <ListItem key={client.id}>
                                        <ListItemButton onClick={() => handleToggle(client.id)}>
                                            <ListItemText
                                                primary={`${client.firstName} ${client.lastName}`}
                                                secondary={`ID: ${client.id}`}
                                            />
                                            {shouldSave && (
                                                <ListItemSecondaryAction>
                                                    {checkedClients.includes(client.id) ? (
                                                        <IconButton color="success"
                                                                    onClick={() => handleToggle(client.id)}>
                                                            <CheckIcon/>
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton color="secondary"
                                                                    onClick={() => handleRemove(client.id)}>
                                                            <ClearIcon/>
                                                        </IconButton>
                                                    )}
                                                </ListItemSecondaryAction>
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </>
                        )}
                    </List>
                </Grid>
                {
                    shouldSave && <Box textAlign="center" mt={2}>
                        <Button variant="contained" sx={{marginRight: "10px"}} onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="contained" onClick={handleClose}>
                            Close
                        </Button>
                    </Box>
                }
            </DialogContent>
        </Dialog>
    );
};

export default ClientModal;

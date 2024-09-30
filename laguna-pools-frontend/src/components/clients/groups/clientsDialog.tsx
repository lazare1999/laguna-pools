import React, {useState} from 'react';
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Modal,
    Typography,
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

interface Client {
    id: number;
    firstName: string;
    lastName: string;
}

interface ClientModalProps {
    clients: Client[];
    open: boolean;
    handleClose: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const ClientModal: React.FC<ClientModalProps> = ({clients, open, handleClose}) => {
    const [checkedClients, setCheckedClients] = useState<number[]>([]);

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

    const handleSave = () => {
        handleClose();
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Select Clients
                </Typography>
                <List>
                    {clients.map((client) => (
                        <ListItem key={client.id}>
                            <ListItemButton onClick={() => handleToggle(client.id)}>
                                <ListItemText
                                    primary={`${client.firstName} ${client.lastName}`}
                                    secondary={`ID: ${client.id}`}
                                />
                                <ListItemSecondaryAction>
                                    {checkedClients.includes(client.id) ? (
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleRemove(client.id)}
                                        >
                                            <ClearIcon/>
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            color="success"
                                            onClick={() => handleToggle(client.id)}
                                        >
                                            <CheckIcon/>
                                        </IconButton>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box textAlign="center" mt={2}>
                    <Button variant="contained" sx={{marginRight: "10px"}} onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="contained" onClick={handleClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ClientModal;
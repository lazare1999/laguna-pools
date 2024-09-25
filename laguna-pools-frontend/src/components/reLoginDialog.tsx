import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import {Box} from '@mui/system';
import authenticateUtils from "../api/authenticateUtils";
import {AlertDialog} from "../utils/alertsUtils";
import {USERNAME} from "../utils/constants";

interface PasswordDialogProps {
    open: boolean;
    onClose: () => void;
    setOpenSessionWindow: (open: boolean) => void;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({open, onClose, setOpenSessionWindow}) => {
    const [password, setPassword] = useState('');
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const username = localStorage.getItem(USERNAME);
            let ans = await authenticateUtils.authenticate(username!, password);

            if (ans) {
                setOpenSessionWindow(true);
                onClose();
            } else {
                setAlertOpen(true);
            }
        } catch (error) {
            setAlertOpen(true);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="password-dialog-title"
            PaperProps={{
                sx: {
                    position: 'absolute',
                    top: '10%',
                    m: '0 auto',
                },
            }}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle id="password-dialog-title" sx={{textAlign: 'center'}}>
                Re-enter Password
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
                <DialogContent>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
                <AlertDialog
                    open={alertOpen}
                    title='Error'
                    message='Enter the correct data'
                    onClose={() => setAlertOpen(false)}
                />
            </Box>
        </Dialog>
    );
};

export default PasswordDialog;

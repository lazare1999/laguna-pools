// src/utils/alertsUtils.tsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ToastProps {
    open: boolean;
    message: string;
    onClose: () => void;
    options?: object;
}

export const Toast: React.FC<ToastProps> = ({open, message, onClose, options}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}} // Center the toast
            {...options}
        >
            <Alert onClose={onClose} severity="success">
                {message}
            </Alert>
        </Snackbar>
    );
};

interface AlertDialogProps {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({open, title, message, onClose}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}} // Center the alert
        >
            <Alert onClose={onClose} severity="error">
                <strong>{title}</strong><br/>
                {message}
            </Alert>
        </Snackbar>
    );
};

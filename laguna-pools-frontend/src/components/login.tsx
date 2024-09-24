import React, {useState} from 'react';
import {Avatar, Box, Button, Container, TextField} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PasswordField from "./common/passwordTextBox";
import {Component} from "../utils/componentsEnum";
import authenticateUtils from "../api/authenticateUtils";
import {AlertDialog} from "../utils/alertsUtils";

interface LoginFormProps {
    selectHandler: (select: Component) => void;
    setOpenSessionWindow: (open: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({selectHandler, setOpenSessionWindow}) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            let ans = await authenticateUtils.authenticate(username, password);

            if (ans) {
                setOpenSessionWindow(true); // Update session window state
                selectHandler(Component.CLIENTS_TABLE);
            } else {
                setAlertOpen(true);
            }
        } catch (error) {
            setAlertOpen(true);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar>
                    <LockOutlinedIcon/>
                </Avatar>
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            }
                        }}
                    />
                    <PasswordField
                        id={'login_password_field_id'}
                        name={'login_password_field_text'}
                        label={'Password'}
                        password={password}
                        onChange={handlePasswordChange}
                        helperText={""}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                    <AlertDialog
                        open={alertOpen}
                        title='Error'
                        message='Enter the correct data'
                        onClose={() => setAlertOpen(false)}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
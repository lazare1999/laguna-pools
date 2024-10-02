import React, {useState} from 'react';
import {Avatar, Box, Button, Container, TextField} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PasswordField from "./common/passwordTextBox";
import {Component} from "../utils/componentsEnum";
import authenticateUtils from "../api/authenticateUtils";
import {AlertDialog} from "../utils/alertsUtils";
import BoxWrapper from "./common/border";

interface LoginFormProps {
    selectHandler: (select: Component) => void;
    setOpenSessionWindow: (open: boolean) => void;
    branchesHandler: (branches: string[]) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({selectHandler, setOpenSessionWindow, branchesHandler}) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            let ans = await authenticateUtils.authenticate(username, password);

            if (ans === "Successfully authenticated") {
                setOpenSessionWindow(true);
                selectHandler(Component.CLIENTS_TABLE);
            } else {
                setAlertMessage(ans);
                setAlertOpen(true);
            }
        } catch (error: any) {
            setAlertMessage(error);
            setAlertOpen(true);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <BoxWrapper>
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
                            message={alertMessage}
                            onClose={() => setAlertOpen(false)}
                        />
                    </Box>
                </Box>
            </Container>
        </BoxWrapper>
    );
};

export default LoginForm;
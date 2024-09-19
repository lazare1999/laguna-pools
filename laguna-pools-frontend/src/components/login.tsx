import React, {useState} from 'react';
import {Avatar, Box, Button, Container, TextField} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PasswordField from "./common/passwordTextBox";
import {Component} from "../utils/componentsEnum";
import authenticateUtils from "../api/authenticateUtils";

interface LoginFormProps {
    selectHandler: (select: Component) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({selectHandler}) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await authenticateUtils.authenticate(username, password).then((promise) => {

            console.log(promise);

            if (promise)
                selectHandler(Component.CLIENTS_TABLE);
            else
                selectHandler(Component.LOGIN);
        });

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
                    />
                    <PasswordField password={password} setPassword={setPassword}/>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
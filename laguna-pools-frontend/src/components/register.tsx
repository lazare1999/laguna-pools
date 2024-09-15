import React, {useState} from 'react';
import {Avatar, Box, Button, Container, TextField} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PasswordField from "./passwordTextBox";

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const request = {username, password};
        console.log(request);
        // Api.register(request);
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
                    <PersonAddIcon/>
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
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterForm;
import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    TextField
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PasswordField from "../common/passwordTextBox";
import authClient from "../../api/api";
import {TargetView} from "../models/targetViewModel";

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [roles, setRoles] = useState<number[]>([]);
    const [availableRoles, setAvailableRoles] = useState<TargetView[]>([]);

    useEffect(() => {
        // Fetch roles when the component mounts
        authClient.get<TargetView[]>("list_roles")
            .then(response => {
                if (response.status === 200)
                    setAvailableRoles(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);

    const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newUser = {username, password, roles};

        authClient.post('add_user', newUser).then(res => {
            if (res.status === 200) {
                window.confirm(`User added successfully, with id of: ${res.data}`);
            } else if (res.status == 400) {
                window.confirm(res.data);
            }
        }).catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
    };

    const handleRoleChange = (targetId: number) => {
        if (roles.includes(targetId)) {
            // Remove role if it's already selected
            setRoles(roles.filter(role => role !== targetId));
        } else {
            // Add role if it's not selected
            setRoles([...roles, targetId]);
        }
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
                <Box component="form" onSubmit={handleAddUser} sx={{mt: 1}}>
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
                    <FormControl component="fieldset" margin="normal">
                        <FormGroup>
                            {availableRoles.map(role => (
                                <FormControlLabel
                                    key={role.targetId}
                                    control={
                                        <Checkbox
                                            checked={roles.includes(role.targetId)}
                                            onChange={() => handleRoleChange(role.targetId)}
                                        />
                                    }
                                    label={role.targetName}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Add User
                    </Button>
                    <div style={{marginTop: '20px'}}>
                        <p>Selected Roles: {roles.join(', ')}</p>
                    </div>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterForm;
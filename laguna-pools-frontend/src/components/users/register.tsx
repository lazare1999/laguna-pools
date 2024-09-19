import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    IconButton,
    InputAdornment,
    TextField
} from '@mui/material';

import authClient from '../../api/api'
import {AlertDialog, Toast} from "../../utils/alertsUtils";
import {HttpMethod} from "../../utils/httpMethodEnum";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import PasswordField from "../common/passwordTextBox";

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [roles, setRoles] = useState<Array<{ targetId: number; targetName: string; targetDescription: string }>>([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [toastMessage, setToastMessage] = useState<string>("");

    useEffect(() => {
        const fetchRolesList = async () => {
            setLoading(true);
            try {
                const rolesData = await authClient.request('admin/list_roles', HttpMethod.GET);
                if (Array.isArray(rolesData.data)) {
                    setRoles(rolesData.data);
                } else {
                    setAlertMessage(`Fetched roles are not an array: ${rolesData.data}`);
                    setAlertOpen(true);
                    setRoles([]);
                }
            } catch (err) {
                setAlertMessage(`Failed to fetch roles: ${err}`);
                setAlertOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchRolesList().then(r => r);
    }, []);

    const handleRoleChange = (roleId: number) => {
        setSelectedRoles(prevRoles =>
            prevRoles.includes(roleId)
                ? prevRoles.filter(id => id !== roleId)
                : [...prevRoles, roleId]
        );
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitLoading(true);

        if (password !== confirmPassword) {
            setAlertMessage('Passwords do not match.');
            setAlertOpen(true);
            setSubmitLoading(false);
            return;
        }

        try {
            const result = await authClient.request('admin/add_user', HttpMethod.POST, {
                username,
                password,
                roles: selectedRoles
            });

            setToastMessage(`User added with id: ${result.data}`);
            setToastOpen(true);

        } catch (err) {
            // @ts-ignore
            const errorMessage = err.response?.data || err.message || "An unexpected error occurred.";
            setAlertMessage(`${errorMessage}`);
            setAlertOpen(true);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Regular expression for strong password
    // const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const strongPasswordRegex = /^([@#](?=[^aeiou]{7,13}$)(?=[[:alnum:]]{7,13}$)(?=.*[A-Z]{1,}.*$).+)$/;

    // Validate password and set error message
    const validatePassword = (pwd: string) => {
        if (!pwd) {
            setPasswordError('Password is required.');
        } else if (!strongPasswordRegex.test(pwd)) {
            setPasswordError('Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.');
        } else {
            setPasswordError(null);
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                            const newPassword = e.target.value;
                            setPassword(newPassword);
                            validatePassword(newPassword);
                        }}
                        helperText={passwordError}
                        error={!!passwordError}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <PasswordField label={'Confirm Password'} password={confirmPassword}
                                   setPassword={setConfirmPassword}/>
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">აირჩიეთ როლები</FormLabel> {/* Add this line for the label */}
                        <FormGroup>
                            {loading ? (
                                <CircularProgress/>
                            ) : (
                                roles.map(role => (
                                    <FormControlLabel
                                        key={role.targetId}
                                        control={
                                            <Checkbox
                                                checked={selectedRoles.includes(role.targetId)}
                                                onChange={() => handleRoleChange(role.targetId)}
                                            />
                                        }
                                        label={role.targetDescription}
                                    />
                                ))
                            )}
                        </FormGroup>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={submitLoading}
                    >
                        {submitLoading ? <CircularProgress size={24}/> : 'Register'}
                    </Button>
                    <Toast
                        open={toastOpen}
                        message={toastMessage}
                        onClose={() => setToastOpen(false)}
                        options={{autoHideDuration: 3000}}
                    />
                    <AlertDialog
                        open={alertOpen}
                        title='Error'
                        message={alertMessage}
                        onClose={() => setAlertOpen(false)}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterForm;

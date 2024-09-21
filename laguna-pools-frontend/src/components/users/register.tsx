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
    TextField
} from '@mui/material';
import authClient from '../../api/api'
import {AlertDialog, Toast} from "../../utils/alertsUtils";
import {HttpMethod} from "../../utils/httpMethodEnum";
import PasswordField from "../common/passwordTextBox";
import {PASSWORD_ERROR_TEXT, STRONG_PASSWORD_REGEX} from "../../utils/constants";

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [roles, setRoles] = useState<Array<{ targetId: number; targetName: string; targetDescription: string }>>([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [toastOpen, setToastOpen] = useState<boolean>(false);
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


    const validatePassword = (pwd: string) => {
        if (!pwd) {
            setPasswordError('Password is required.');
        } else if (!STRONG_PASSWORD_REGEX.test(pwd)) {
            setPasswordError(PASSWORD_ERROR_TEXT);
        } else {
            setPasswordError("");
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    // Check if form is valid for submission
    const isFormValid = () => {
        return (
            username &&
            password &&
            confirmPassword &&
            !passwordError &&
            password === confirmPassword &&
            selectedRoles.length > 0
        );
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
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            }
                        }}
                    />
                    <PasswordField
                        label="Password"
                        password={password}
                        onChange={handlePasswordChange}
                        helperText={passwordError}
                    />
                    <PasswordField
                        label="Confirm Password"
                        password={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        helperText={""}
                    />
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Select Roles</FormLabel>
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
                        disabled={submitLoading || !isFormValid()}
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
                        title="Error"
                        message={alertMessage}
                        onClose={() => setAlertOpen(false)}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterForm;

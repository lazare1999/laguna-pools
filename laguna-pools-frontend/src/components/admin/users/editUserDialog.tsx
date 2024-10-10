import React, {useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {User} from "../../models/admin/usersModel";
import {AlertDialog} from "../../../utils/alertsUtils";
import {PASSWORD_ERROR_TEXT, STRONG_PASSWORD_REGEX} from "../../../utils/constants";
import PasswordField from "../../common/passwordTextBox";
import authClient from "../../../api/api";
import {HttpMethod} from "../../../utils/enums/httpMethodEnum";
import {TargetView} from "../../models/admin/targetViewModel";
import {BranchModel} from "../../models/admin/branchModel";

interface EditUserDialogProps {
    open: boolean;
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
    roles: Array<TargetView>;
    branches: Array<BranchModel>;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({open, user, onClose, onSave, roles, branches}) => {
    const [editedUser, setEditedUser] = useState<User>(user);
    const [password, setPassword] = useState<string>("");
    const [branchName, setBranchName] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>("");

    const [passwordError, setPasswordError] = useState<string>("");

    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);


    const updateUserRoles = () => {
        setSelectedRoles(user.rolesIds);
    };

    const updateUserBranch = () => {
        setBranchName(user.branch.branchName);
    };

    useEffect(() => {
        updateUserRoles();
        updateUserBranch();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleRoleChange = (roleId: number) => {
        setSelectedRoles(prevRoles =>
            prevRoles.includes(roleId)
                ? prevRoles.filter(id => id !== roleId)
                : [...prevRoles, roleId]
        );
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
    };

    const handleSave = async () => {
        if (password !== repeatPassword) {
            setAlertMessage('Passwords do not match!');
            setAlertOpen(true);
            return;
        }

        try {
            const response = await authClient.request('admin/user/edit_user', HttpMethod.POST, {
                userId: editedUser.userId,
                newUsername: editedUser.username,
                newPassword: password,
                newRoles: selectedRoles,
                newBranch: branchName
            });

            if (response.status === 200) {
                editedUser.roles = roles
                    .filter(role => selectedRoles.includes(role.targetId))
                    .map(role => role.targetDescription);

                editedUser.branch.branchName = branchName;

                onSave(editedUser);
                onClose();
            } else {
                setAlertMessage('Failed to change user info. Please try again.');
                setAlertOpen(true);
            }
        } catch (error) {
            setAlertMessage(`An error occurred while changing user info: ${error}`);
            setAlertOpen(true);
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

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <TextField
                    label="Username"
                    name="username"
                    value={editedUser.username}
                    onChange={handleInputChange}
                    fullWidth
                    autoComplete="off"
                    margin="dense"
                />
                <PasswordField
                    id={'edit_user_password_field_id'}
                    name={'edit_user_password_field_text'}
                    helperText={passwordError}
                    onChange={handlePasswordChange}
                    label={'Password'}
                    password={password}
                />
                <PasswordField
                    id={'edit_user_confirm_password_field_id'}
                    name={'edit_user_confirm_password_field_text'}
                    label="Confirm Password"
                    password={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    helperText={""}
                />
                <FormControl
                    id={`edit-user-branch-id`}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                >
                    <InputLabel id={`branch-select-label`}>Select Branch</InputLabel>
                    <Select
                        labelId={`branch-select-label`}
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        label="Select Branch"
                        autoFocus
                    >
                        {branches.map(b => (
                            <MenuItem id={`edit-user-branch-menu-item-id-${b.id}`} key={b.id} value={b.branchName}>
                                {b.branchName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Select Roles</FormLabel>
                    <FormGroup>
                        {
                            roles.map(role => (
                                <FormControlLabel
                                    key={role.targetId}
                                    control={
                                        <Checkbox
                                            id={`edit-user-page-roles-${role.targetId}`}
                                            checked={selectedRoles.includes(role.targetId)}
                                            onChange={() => handleRoleChange(role.targetId)}
                                        />
                                    }
                                    label={role.targetDescription}
                                />
                            ))
                        }
                    </FormGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
            <AlertDialog
                open={alertOpen}
                title="Error"
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
        </Dialog>
    );
};

export default EditUserDialog;
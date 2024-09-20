import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from "@mui/material";
import {User} from "../models/usersModel";

interface EditUserDialogProps {
    open: boolean;
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({open, user, onClose, onSave}) => {
    const [editedUser, setEditedUser] = useState<User>(user);
    const [password, setPassword] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>("");

    const roles = ["Admin", "User", "Manager"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
    };

    const handleSave = () => {
        if (password !== repeatPassword) {
            alert("Passwords do not match!");
            return;
        }
        const updatedUser = {
            ...editedUser,
            password: password || editedUser.password, // Only update password if it's provided
        };
        onSave(updatedUser);
        onClose();
    };

    const handleRolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser((prevUser) => ({
            ...prevUser,
            roles: [e.target.value],
        }));
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
                    margin="dense"
                />
                <TextField
                    label="Last Auth Date"
                    name="lastAuthDate"
                    value={editedUser.lastAuthDate}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Repeat Password"
                    type="password"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Roles"
                    name="roles"
                    select
                    value={editedUser.roles[0]}
                    onChange={handleRolesChange}
                    fullWidth
                    margin="dense"
                >
                    {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                            {role}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserDialog;
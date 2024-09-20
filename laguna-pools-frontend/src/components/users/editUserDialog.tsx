import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {User} from "../models/usersModel";

interface EditUserDialogProps {
    open: boolean;
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({open, user, onClose, onSave}) => {
    const [editedUser, setEditedUser] = useState<User>(user);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(editedUser);
        onClose();
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

import React, {useState} from "react";
import {IconButton, TableCell, TableRow} from "@mui/material";
import {User} from "../models/usersModel";
import {Delete} from "@mui/icons-material";
import {Toast} from "../../utils/alertsUtils";
import EditUserDialog from "./editUserDialog";

interface UserRowProps {
    user: User;
    onDelete: (userToDelete: User) => void;
    onSaveEdit: (updatedUser: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({user, onDelete, onSaveEdit}) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const handleEditClick = () => {
        setDialogOpen(true);
    };

    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
            onDelete(user);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleSaveEdit = (updatedUser: User) => {
        onSaveEdit(updatedUser);
        setToastMessage(`User ${updatedUser.username} has been updated!`);
        setToastOpen(true);
    };

    return (
        <>
            <Toast
                open={toastOpen}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
                options={{autoHideDuration: 3000}}
            />
            <TableRow onClick={handleEditClick} style={{cursor: 'pointer'}}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.lastAuthDate}</TableCell>
                <TableCell>
                    <IconButton onClick={handleDeleteClick} color="error">
                        <Delete/>
                    </IconButton>
                </TableCell>
            </TableRow>
            <EditUserDialog
                open={dialogOpen}
                user={user}
                onClose={handleDialogClose}
                onSave={handleSaveEdit}
            />
        </>
    );
};

export default UserRow;
import React, {useState} from "react";
import {IconButton, TableCell, TableRow} from "@mui/material";
import {User} from "../../models/usersModel";
import {Toast} from "../../../utils/alertsUtils";
import EditUserDialog from "../editUserDialog";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import {format} from "date-fns";

interface UserRowProps {
    user: User;
    rowIndex: number;
    onLock: (userLock: User) => void;
    onDelete: (userToDelete: User) => void;
    onSaveEdit: (updatedUser: User) => void;
}

const ActiveUserRow: React.FC<UserRowProps> = ({user, rowIndex, onLock, onDelete, onSaveEdit}) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const handleEditClick = () => {
        setDialogOpen(true);
    };

    const handleLockUserClick = () => {
        const action = user.isLocked ? 'unlock' : 'lock';
        if (window.confirm(`Are you sure you want to ${action} ${user.username}?`)) {
            setToastMessage(`User ${user.username} has been ${user.isLocked ? 'unlocked' : 'locked'}!`);
            setToastOpen(true);

            // unlock_or_lock_user

            user.isLocked = !user.isLocked;
            onLock(user);
        }
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

    const formattedLastAuthDate = format(new Date(user.lastAuthDate), 'MMMM dd, yyyy, hh:mm a');

    return (
        <>
            <Toast
                open={toastOpen}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
                options={{autoHideDuration: 3000}}
            />
            <TableRow style={{cursor: 'pointer'}}>
                <TableCell>{rowIndex}</TableCell>
                <TableCell onClick={handleEditClick}>{user.username}</TableCell>
                <TableCell>{formattedLastAuthDate}</TableCell>
                <TableCell>
                    <IconButton onClick={handleLockUserClick} color="info">
                        {user.isLocked ? <LockOutlinedIcon color="warning"/> : <LockOpenOutlinedIcon/>}
                    </IconButton>
                    <IconButton onClick={handleDeleteClick} color="error">
                        <PersonRemoveAlt1OutlinedIcon/>
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

export default ActiveUserRow;

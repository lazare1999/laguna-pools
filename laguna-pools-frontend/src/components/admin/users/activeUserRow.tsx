import React, {useState} from "react";
import {Chip, IconButton, TableCell, TableRow} from "@mui/material";
import {User} from "../../models/admin/usersModel";
import {AlertDialog, Toast} from "../../../utils/alertsUtils";
import EditUserDialog from "./editUserDialog";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import {format} from "date-fns";
import authClient from "../../../api/api";
import {HttpMethod} from "../../../utils/enums/httpMethodEnum";
import {TargetView} from "../../models/admin/targetViewModel";
import {BranchModel} from "../../models/admin/branchModel";

interface UserRowProps {
    user: User;
    rowIndex: number;
    onLock: (userLock: User) => void;
    onDelete: (userToDelete: User) => void;
    onSaveEdit: (updatedUser: User) => void;
    roles: Array<TargetView>;
    branches: Array<BranchModel>;
    inActiveUsers: boolean;
}

const ActiveUserRow: React.FC<UserRowProps> = ({
                                                   user,
                                                   rowIndex,
                                                   onLock,
                                                   onDelete,
                                                   onSaveEdit,
                                                   roles,
                                                   branches,
                                                   inActiveUsers
                                               }) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const handleEditClick = () => {
        setDialogOpen(true);
    };

    const handleLockUserClick = async () => {
        const action = user.isLocked ? 'unlock' : 'lock';
        if (window.confirm(`Are you sure you want to ${action} ${user.username}?`)) {
            try {
                const response = await authClient.request(`admin/user/unlock_or_lock_user?userId=${user.userId}`, HttpMethod.POST);
                if (response.status === 200) {
                    const wasLocked = user.isLocked;
                    setToastMessage(`User ${user.username} has been ${wasLocked ? 'unlocked' : 'locked'}!`);
                    setToastOpen(true);

                    user.isLocked = !wasLocked;
                    onLock(user);
                } else {
                    setAlertMessage('Failed to change user lock status. Please try again.');
                    setAlertOpen(true);
                }
            } catch (error) {
                setAlertMessage(`An error occurred while changing user lock status: ${error}`);
                setAlertOpen(true);
            }
        }
    };

    const handleDeleteClick = async () => {

        let text = inActiveUsers ? `Are you sure you want to activate ${user.username}?` : `Are you sure you want to delete ${user.username}?`;
        if (window.confirm(text)) {
            try {
                const response = await authClient.request(`admin/user/disable_or_enable_user?userId=${user.userId}`, HttpMethod.POST);
                if (response.status === 200) {
                    const wasLocked = user.isLocked;
                    user.isLocked = !wasLocked;
                    onDelete(user);
                } else {
                    setAlertMessage('Failed to change user status. Please try again.');
                    setAlertOpen(true);
                }
            } catch (error) {
                setAlertMessage(`An error occurred while changing user status: ${error}`);
                setAlertOpen(true);
            }
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
            <AlertDialog
                open={alertOpen}
                title="Error"
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
            <TableRow onDoubleClick={handleEditClick} style={{cursor: 'pointer'}}>
                <TableCell>{rowIndex}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{formattedLastAuthDate}</TableCell>
                <TableCell>
                    {user.roles.map((role, index) => (
                        <Chip key={index} label={role} style={{margin: '5px'}}/>
                    ))}
                </TableCell>
                <TableCell>{user.branch.branchName}</TableCell>
                <TableCell>
                    <IconButton onClick={handleLockUserClick} color="info">
                        {user.isLocked ? <LockOutlinedIcon color="warning"/> : <LockOpenOutlinedIcon/>}
                    </IconButton>
                    <IconButton onClick={handleDeleteClick} color="error">
                        {inActiveUsers ? <PersonAddAlt1OutlinedIcon color="success"/> : <PersonRemoveAlt1OutlinedIcon/>}
                    </IconButton>
                </TableCell>
            </TableRow>
            <EditUserDialog
                open={dialogOpen}
                user={user}
                onClose={handleDialogClose}
                onSave={handleSaveEdit}
                roles={roles}
                branches={branches}
            />
        </>
    );
};

export default ActiveUserRow;

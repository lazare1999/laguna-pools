import React, {useState} from "react";
import {IconButton, TableCell, TableRow} from "@mui/material";
import {User} from "../models/usersModel";
import {Delete} from "@mui/icons-material";
import {Toast} from "../../utils/alertsUtils"; // Import the User type

interface UserRowProps {
    user: User;
    onDelete: (userToDelete: User) => void;
}


const UserRow: React.FC<UserRowProps> = ({user, onDelete}) => {

    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const handleEditClick = () => {

        setToastMessage(`EDIT`);
        setToastOpen(true);
    };

    const handleDeleteClick = () => {
        window.confirm(`Are you sure you want to delete ${user.username}?`);

    };

    return (
        <TableRow>
            <Toast
                open={toastOpen}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
                options={{autoHideDuration: 3000}}
            />
            <TableCell>{user.userId}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.lastAuthDate}</TableCell>
            <TableCell>
                {/*<IconButton onClick={handleEditClick}>*/}
                {/*    <Edit/>*/}
                {/*</IconButton>*/}
                <IconButton onClick={handleDeleteClick} color="error">
                    <Delete/>
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default UserRow;

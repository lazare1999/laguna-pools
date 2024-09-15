import React, {useState} from "react";
import {Checkbox, IconButton, TableCell, TableRow, TextField} from "@mui/material";
import {Delete, Edit, Save} from "@mui/icons-material";

interface User {
    firstName: string;
    lastName: string;
    expirationDate: string;
    attended: boolean;
    plan: string;
    sessions: number;
    notes: string;
}

interface UserRowProps {
    user: User;
    onDelete: (user: User) => void;  // Pass the delete handler as a prop
}

const UserRow: React.FC<UserRowProps> = ({user, onDelete}) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editableUser, setEditableUser] = useState<User>(user);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        setEditMode(false);
    };

    const handleInputChange = (field: string, value: string | boolean | number) => {
        setEditableUser({
            ...editableUser,
            [field]: value,
        });
    };

    const handleDeleteClick = () => {
        const confirmed = window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`);
        if (confirmed) {
            onDelete(user);  // Call the onDelete handler when confirmed
        }
    };

    return (
        <TableRow>
            {editMode ? (
                <>
                    <TableCell>
                        <TextField
                            value={editableUser.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                        <TextField
                            value={editableUser.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            type="date"
                            value={editableUser.expirationDate}
                            onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <Checkbox
                            checked={editableUser.attended}
                            onChange={(e) => handleInputChange("attended", e.target.checked)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            value={editableUser.plan}
                            onChange={(e) => handleInputChange("plan", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            type="number"
                            value={editableUser.sessions}
                            onChange={(e) => handleInputChange("sessions", +e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            value={editableUser.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <IconButton onClick={handleSaveClick}>
                            <Save/>
                        </IconButton>
                    </TableCell>
                </>
            ) : (
                <>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.expirationDate}</TableCell>
                    <TableCell>
                        <Checkbox checked={user.attended} disabled/>
                    </TableCell>
                    <TableCell>{user.plan}</TableCell>
                    <TableCell>{user.sessions}</TableCell>
                    <TableCell>{user.notes}</TableCell>
                    <TableCell>
                        <IconButton onClick={handleEditClick}>
                            <Edit/>
                        </IconButton>
                        <IconButton onClick={handleDeleteClick} color="error">
                            <Delete/>
                        </IconButton>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
};

export default UserRow;
import React, {useState} from "react";
import {IconButton, MenuItem, Select, TableCell, TableRow, TextField} from "@mui/material";
import {Delete, Edit, Save} from "@mui/icons-material";

export interface SystemUser {
    firstName: string;
    lastName: string;
    lastJoinedDate: string;
    role: string;
}

interface UserRowProps {
    user: SystemUser;
    onDelete: (userToDelete: SystemUser) => void;
}

const ClientRow: React.FC<UserRowProps> = ({user, onDelete}) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editableUser, setEditableUser] = useState<SystemUser>(user);

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
            onDelete(user);
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
                            value={editableUser.lastJoinedDate}
                            onChange={(e) => handleInputChange("lastJoinedDate", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <Select
                            value={editableUser.role}
                        >
                            <MenuItem onClick={() => handleInputChange("role", "Admin")} value="Admin">Admin</MenuItem>
                            <MenuItem onClick={() => handleInputChange("role", "User")} value="User">User</MenuItem>
                            <MenuItem onClick={() => handleInputChange("role", "Moderator")}
                                      value="Moderator">Moderator</MenuItem>
                        </Select>
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
                    <TableCell>{user.lastJoinedDate}</TableCell>
                    <TableCell>{user.role}</TableCell>
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

export default ClientRow;
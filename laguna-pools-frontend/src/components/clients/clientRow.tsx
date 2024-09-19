import React, {useState} from "react";
import {Checkbox, IconButton, TableCell, TableRow, TextField} from "@mui/material";
import {Delete, Edit, Save} from "@mui/icons-material";

interface Client {
    firstName: string;
    lastName: string;
    expirationDate: string;
    attended: boolean;
    plan: string;
    sessions: number;
    notes: string;
}

interface UserRowProps {
    user: Client;
    onDelete: (user: Client) => void;
}

const ClientRow: React.FC<UserRowProps> = ({user, onDelete}) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editableClient, setEditableClient] = useState<Client>(user);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        setEditMode(false);
    };

    const handleInputChange = (field: string, value: string | boolean | number) => {
        setEditableClient({
            ...editableClient,
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
                            value={editableClient.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                        <TextField
                            value={editableClient.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            type="date"
                            value={editableClient.expirationDate}
                            onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <Checkbox
                            checked={editableClient.attended}
                            onChange={(e) => handleInputChange("attended", e.target.checked)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            value={editableClient.plan}
                            onChange={(e) => handleInputChange("plan", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            type="number"
                            value={editableClient.sessions}
                            onChange={(e) => handleInputChange("sessions", +e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            value={editableClient.notes}
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

export default ClientRow;
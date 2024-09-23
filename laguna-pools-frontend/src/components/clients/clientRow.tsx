import React, {useState} from "react";
import {Checkbox, IconButton, TableCell, TableRow, TextField} from "@mui/material";
import {Delete, Edit, Save} from "@mui/icons-material";

export interface Client {
    firstName: string;
    lastName: string;
    age: string;
    cost: number;
    phoneNumber: string;
    idStatus: string;
    expDate: string; // Format: "YYYY-MM-DD"
    doctorCheckStatus: boolean;
    notes: string;
}

interface ClientRowProps {
    client: Client;
    onDelete: (user: Client) => void;
}

const ClientRow: React.FC<ClientRowProps> = ({client, onDelete}) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editableClient, setEditableClient] = useState<Client>(client);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        setEditMode(false);
    };

    const handleInputChange = (field: keyof Client, value: string | boolean | number) => {
        setEditableClient({
            ...editableClient,
            [field]: value,
        });
    };

    const handleDeleteClick = () => {
        const confirmed = window.confirm(`Are you sure you want to delete ${client.firstName} ${client.lastName}?`);
        if (confirmed) {
            onDelete(client);
        }
    };

    return (
        <TableRow>
            {editMode ? (
                <>
                    <TableCell>
                        <TextField
                            label="First Name"
                            value={editableClient.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                        <TextField
                            label="Last Name"
                            value={editableClient.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="Age"
                            value={editableClient.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="Cost"
                            type="number"
                            value={editableClient.cost}
                            onChange={(e) => handleInputChange("cost", parseFloat(e.target.value))}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="Phone Number"
                            value={editableClient.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="ID Status"
                            value={editableClient.idStatus}
                            onChange={(e) => handleInputChange("idStatus", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="Expiration Date"
                            type="date"
                            value={editableClient.expDate}
                            onChange={(e) => handleInputChange("expDate", e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <Checkbox
                            checked={editableClient.doctorCheckStatus}
                            onChange={(e) => handleInputChange("doctorCheckStatus", e.target.checked)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="Notes"
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
                    <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                    <TableCell>{client.age}</TableCell>
                    <TableCell>{client.cost}</TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>{client.idStatus}</TableCell>
                    <TableCell>{client.expDate}</TableCell>
                    <TableCell>
                        <Checkbox checked={client.doctorCheckStatus} disabled/>
                    </TableCell>
                    <TableCell>{client.notes}</TableCell>
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

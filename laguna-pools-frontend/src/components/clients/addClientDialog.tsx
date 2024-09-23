import React, {useState} from "react";
import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from "@mui/material";
import {MockClient} from "../../utils/mockClients";

interface AddClientDialogProps {
    open: boolean;
    onClose: () => void;
    onAddClient: (client: MockClient) => void;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({open, onClose, onAddClient}) => {
    const [newClient, setNewClient] = useState<MockClient>({
        firstName: "",
        lastName: "",
        age: "",
        cost: 0,
        phoneNumber: "",
        idStatus: "",
        expDate: "",
        doctorCheckStatus: false,
        notes: "",
    });

    const handleInputChange = (field: keyof MockClient, value: string | boolean | number) => {
        setNewClient({
            ...newClient,
            [field]: value,
        });
    };

    const handleAddClient = () => {
        onAddClient(newClient);
        setNewClient({
            firstName: "",
            lastName: "",
            age: "",
            cost: 0,
            phoneNumber: "",
            idStatus: "",
            expDate: "",
            doctorCheckStatus: false,
            notes: "",
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogContent>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newClient.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newClient.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
                <TextField
                    label="Age"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newClient.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                />
                <TextField
                    label="Cost"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newClient.cost}
                    onChange={(e) => handleInputChange("cost", +e.target.value)}
                />
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newClient.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
                <TextField
                    label="ID Status"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newClient.idStatus}
                    onChange={(e) => handleInputChange("idStatus", e.target.value)}
                />
                <TextField
                    label="Expiration Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newClient.expDate}
                    onChange={(e) => handleInputChange("expDate", e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Checkbox
                    checked={newClient.doctorCheckStatus}
                    onChange={(e) => handleInputChange("doctorCheckStatus", e.target.checked)}
                />
                <label>Doctor Check Status</label>
                <TextField
                    label="Notes"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newClient.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAddClient} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientDialog;

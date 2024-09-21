import React, {useState} from "react";
import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from "@mui/material";
import {MockClient} from "../../utils/mockClients";

interface AddUserDialogProps {
    open: boolean;
    onClose: () => void;
    onAddUser: (user: MockClient) => void;
}

const AddClientDialog: React.FC<AddUserDialogProps> = ({open, onClose, onAddUser}) => {
    const [newUser, setNewUser] = useState<MockClient>({
        firstName: "",
        lastName: "",
        expirationDate: "",
        attended: false,
        plan: "",
        sessions: 0,
        notes: "",
    });

    const handleInputChange = (field: string, value: string | boolean | number) => {
        setNewUser({
            ...newUser,
            [field]: value,
        });
    };

    const handleAddUser = () => {
        onAddUser(newUser);
        setNewUser({
            firstName: "",
            lastName: "",
            expirationDate: "",
            attended: false,
            plan: "",
            sessions: 0,
            notes: "",
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newUser.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newUser.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
                <TextField
                    label="Expiration Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newUser.expirationDate}
                    onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
                <TextField
                    label="Plan"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newUser.plan}
                    onChange={(e) => handleInputChange("plan", e.target.value)}
                />
                <TextField
                    label="Sessions"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newUser.sessions}
                    onChange={(e) => handleInputChange("sessions", +e.target.value)}
                />
                <TextField
                    label="Notes"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newUser.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                />
                <Checkbox
                    checked={newUser.attended}
                    onChange={(e) => handleInputChange("attended", e.target.checked)}
                />
                <label>Attended</label>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAddUser} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientDialog;
import React, {useState} from "react";
import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import {Client} from "../models/clients/clientsModel";
import {DayEnum} from "../../utils/enums/DayEnum";
import {HoursEnum} from "../../utils/enums/HoursEnum";
import {GroupModel} from "../models/groups/GroupModel";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import {Box} from "@mui/system";
import Divider from '@mui/material/Divider';
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";
import CustomDialogTitle from "../common/lagunaDialog";
import {TYPES} from "./constants";

interface AddClientDialogProps {
    open: boolean;
    onClose: () => void;
    onAddClient: (client: Client) => void;
    openToastHandler: () => void;
    toastMessageHandler: (message: string) => void;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({
                                                             open,
                                                             onClose,
                                                             onAddClient,
                                                             openToastHandler,
                                                             toastMessageHandler
                                                         }) => {
    const [newClient, setNewClient] = useState<Client>({debt: 0, type: "Individual"} as Client);
    const [dayHourPairs, setDayHourPairs] = useState<GroupModel[]>([{
        id: 0,
        day: DayEnum.SUNDAY,
        hour: HoursEnum.HOUR_09
    }]);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

    const handleInputChange = (field: keyof Client, value: string | boolean | number) => {
        setNewClient({
            ...newClient,
            [field]: value,
        });
    };

    const handlePhoneNumberChange = (value: string) => {
        const regex = /^[0-9,]*$/;
        if (regex.test(value)) {
            if (value.length <= 20) {
                handleInputChange("phoneNumber", value);
            } else {
                setAlertMessage("Phone number must be 20 characters or less.");
                setAlertOpen(true);
                handleInputChange("phoneNumber", value.substring(0, 20));
            }
        } else {
            const updatedValue = value.slice(0, -1);
            handleInputChange("phoneNumber", updatedValue);
            setAlertMessage("Phone number must contain only digits and commas.");
            setAlertOpen(true);
        }
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleCheckboxChange = (field: keyof Client, checked: boolean) => {
        setNewClient({
            ...newClient,
            [field]: checked,
        });
    };

    const handleAddClient = async () => {
        if (!newClient.firstName || !newClient.lastName) {
            setError("Must not be empty.");
            return;
        }

        newClient.groups = dayHourPairs;

        try {
            setIsButtonDisabled(true);
            const result = await authClient.request('clients', HttpMethod.POST, newClient);

            openToastHandler();
            toastMessageHandler(result.data);

            onAddClient(newClient);
            setNewClient({} as Client);
            setDayHourPairs([{id: 0, day: DayEnum.SUNDAY, hour: HoursEnum.HOUR_09}]);
            onClose();

        } catch (err) {
            // @ts-ignore
            const errorMessage = err.response?.data || err.message || "An unexpected error occurred.";
            setAlertMessage(`${errorMessage}`);
            setAlertOpen(true);
        } finally {
            setTimeout(() => {
                setIsButtonDisabled(false);
            }, 5000);
        }
    };

    const handleAddPair = () => {
        setDayHourPairs([...dayHourPairs, {id: 0, day: DayEnum.SUNDAY, hour: HoursEnum.HOUR_09}]);
    };

    const handleRemovePair = (index: number) => {
        const newPairs = dayHourPairs.filter((_, i) => i !== index);
        setDayHourPairs(newPairs);
    };

    const handleDayChange = (index: number, value: DayEnum) => {
        const newPairs = [...dayHourPairs];
        newPairs[index].day = value;
        setDayHourPairs(newPairs);
    };

    const handleHourChange = (index: number, value: HoursEnum) => {
        const newPairs = [...dayHourPairs];
        newPairs[index].hour = value;
        setDayHourPairs(newPairs);
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <CustomDialogTitle>Add Client</CustomDialogTitle>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseAlert} severity="error">
                    {alertMessage}
                </Alert>
            </Snackbar>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newClient.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            error={!!error}
                            helperText={error && !newClient.firstName ? error : ""}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newClient.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            error={!!error}
                            helperText={error && !newClient.lastName ? error : ""}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newClient.phoneNumber}
                            onChange={(e) => handlePhoneNumberChange(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <TextField
                            label="Birthday"
                            type="date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newClient.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Expiration Date"
                            type="date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newClient.expDate}
                            onChange={(e) => handleInputChange("expDate", e.target.value)}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Doctor Check"
                            type="date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newClient.doctorCheckTill}
                            onChange={(e) => handleInputChange("doctorCheckTill", e.target.value)}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Box display="flex" alignItems="center" height="100%">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={newClient.idStatus || false}
                                        onChange={(e) => handleCheckboxChange("idStatus", e.target.checked)}
                                    />
                                }
                                label="ID Status"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box display="flex" alignItems="center" height="100%">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={newClient.contractStatus || false}
                                        onChange={(e) => handleCheckboxChange("contractStatus", e.target.checked)}
                                    />
                                }
                                label="Contract Status"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Debt"
                            type="number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newClient.debt}
                            onChange={(e) => handleInputChange("debt", +e.target.value)}
                        />
                    </Grid>
                </Grid>
                <TextField
                    label="Notes"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={newClient.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                />
                <FormControl
                    fullWidth
                    variant="outlined"
                >
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={newClient.type}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                        label="Type"
                        fullWidth
                        variant="outlined"
                    >
                        {TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="h6">
                    Groups
                </Typography>
                <Divider></Divider>
                {dayHourPairs.map((pair, index) => (
                    <div key={index} style={{display: 'flex', gap: '1rem', marginBottom: '1rem', marginTop: '1rem'}}>
                        <FormControl
                            id={`add-client-days-id-${newClient.id}`}
                            fullWidth
                            variant="outlined"
                        >
                            <InputLabel id={`day-select-label-${index}`}>Day</InputLabel>
                            <Select
                                labelId={`day-select-label-${index}`}
                                value={pair.day || ""}
                                onChange={(e) => handleDayChange(index, e.target.value as DayEnum)}
                                label="Day"
                            >
                                {Object.values(DayEnum).map((day) => (
                                    <MenuItem id={`add-client-menu-item-day-id-${day}`} key={day} value={day}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl
                            id={`add-client-hours-id-${newClient.id}`}
                            fullWidth
                            variant="outlined"
                        >
                            <InputLabel id={`hour-select-label-${index}`}>Hour</InputLabel>
                            <Select
                                labelId={`hour-select-label-${index}`}
                                value={pair.hour || ""}
                                onChange={(e) => handleHourChange(index, e.target.value as HoursEnum)}
                                label="Hour"
                            >
                                {Object.values(HoursEnum).map((hour) => (
                                    <MenuItem id={`add-client-menu-item-hours-id-${hour}`} key={hour} value={hour}>
                                        {hour}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button onClick={() => handleRemovePair(index)} color="error"><ClearOutlinedIcon/></Button>
                    </div>
                ))}

                <Button onClick={handleAddPair} color="primary"><GroupAddOutlinedIcon/></Button>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAddClient} color="primary" disabled={isButtonDisabled}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientDialog;

import React from "react";
import {
    Button,
    Card,
    CardContent,
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
    TextField,
    Typography,
} from "@mui/material";
import {Cancel, CheckCircle} from "@mui/icons-material";
import {DialogFilters} from "../models/clients/clientFilterModels";
import CustomDialogTitle from "../common/lagunaDialog";
import {TYPES} from "./constants";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onApplyFilters: (filters: any) => void;
    filters: DialogFilters;
    setFilters: React.Dispatch<React.SetStateAction<DialogFilters>>;
}

const filterFields = [
    {label: "First Name", key: "name", type: "text"},
    {label: "Birth Day From", key: "birthDayFrom", type: "date"},
    {label: "Birth Day To", key: "birthDayTo", type: "date"},
    {label: "Exp. Day From", key: "expDayFrom", type: "date"},
    {label: "Exp. Day To", key: "expDayTo", type: "date"},
    {label: "Doc. Day From", key: "docDayFrom", type: "date"},
    {label: "Doc. Day To", key: "docDayTo", type: "date"},
    {label: "Debt From", key: "debtFrom", type: "number"},
    {label: "Debt To", key: "debtTo", type: "number"},
    {label: "Notes", key: "notes", type: "text"},
];

const FilterDialog: React.FC<FilterDialogProps> = ({
                                                       open,
                                                       onClose,
                                                       onApplyFilters,
                                                       filters,
                                                       setFilters,
                                                   }) => {

    const handleChange =
        (key: keyof DialogFilters) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setFilters({...filters, [key]: event.target.value});
            };

    const handleStatusChange =
        (key: "idStatus" | "contractStatus") =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setFilters({...filters, [key]: event.target.checked});
            };

    const handleSubmit = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleInputChange = (key: keyof DialogFilters, value: string | boolean | number) => {
        setFilters({...filters, [key]: value});
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <CustomDialogTitle>Filter Clients</CustomDialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {filterFields.map(({label, key, type}) => (
                        <Grid item xs={12} key={key}>
                            <TextField
                                label={label}
                                value={filters[key as keyof DialogFilters]}
                                onChange={handleChange(key as keyof DialogFilters)}
                                type={type}
                                margin="dense"
                                fullWidth
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    }
                                }}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <FormControl
                            margin="dense"
                            fullWidth
                            variant="outlined"
                        >
                            <InputLabel>Type</InputLabel>
                            <Select
                                label="Type"
                                value={filters.type}
                                onChange={(e) => handleInputChange("type", e.target.value)}
                                fullWidth
                                MenuProps={{PaperProps: {style: {maxHeight: 200}}}}
                            >
                                {TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {["idStatus", "contractStatus"].map((status) => (
                        <Grid item xs={6} key={status}>
                            <Card variant="outlined" sx={{boxShadow: 3, borderRadius: 2}}>
                                <CardContent sx={{display: "flex", alignItems: "center"}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                icon={<Cancel/>}
                                                checkedIcon={<CheckCircle/>}
                                                checked={!!filters[status as keyof DialogFilters]}
                                                onChange={handleStatusChange(status as "idStatus" | "contractStatus")}
                                                sx={{color: filters[status as keyof DialogFilters] ? "success.main" : "error.main"}}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                                {status === "idStatus" ? "ID Status" : "Contract Status"}
                                            </Typography>
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Apply Filters
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FilterDialog;

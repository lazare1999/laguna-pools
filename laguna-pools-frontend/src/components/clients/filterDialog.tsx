import React from "react";
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import {Cancel, CheckCircle} from "@mui/icons-material";
import {DialogFilters} from "../models/clients/clientFilterModels";
import CustomDialogTitle from "../common/lagunaDialog";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onApplyFilters: (filters: any) => void;
    filters: DialogFilters;
    setFilters: React.Dispatch<React.SetStateAction<DialogFilters>>;
}

const filterFields = [
    {label: "First Name", key: "name", type: "text"},
    {label: "Type", key: "type", type: "text"},
    {label: "Birth Day From", key: "birthDayFrom", type: "date"},
    {label: "Birth Day To", key: "birthDayTo", type: "date"},
    {label: "Exp. Day From", key: "expDayFrom", type: "date"},
    {label: "Exp. Day To", key: "expDayTo", type: "date"},
    {label: "Doc. Day From", key: "docDayFrom", type: "date"},
    {label: "Doc. Day To", key: "docDayTo", type: "date"},
    {label: "Cost From", key: "costFrom", type: "number"},
    {label: "Cost To", key: "costTo", type: "number"},
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

import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import {Cancel, CheckCircle} from "@mui/icons-material";
import {DialogFilters} from "../models/clientFilterModels";
import {GroupModel} from "../models/GroupModel";
import authClient from "../../api/api";
import {HttpMethod} from "../../utils/enums/httpMethodEnum";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onApplyFilters: (filters: any) => void;
    filters: DialogFilters;
    setFilters: React.Dispatch<React.SetStateAction<DialogFilters>>;
}

const filterFields = [
    {label: "Phone", key: "phone", type: "text"},
    {label: "Parent", key: "parent", type: "text"},
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
    const [groups, setGroups] = useState<GroupModel[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await authClient.request(
                    "clients/list_groups",
                    HttpMethod.GET
                );
                setGroups(response.data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchGroups().then(r => r);
    }, []);

    const handleChange =
        (key: keyof DialogFilters) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setFilters({...filters, [key]: event.target.value});
            };

    const handleGroupChange = (event: SelectChangeEvent<typeof filters.selectedGroups>) => {
        const {value} = event.target;

        const newSelectedGroups = typeof value === "string" ? value.split(",") : value;

        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedGroups: newSelectedGroups,
        }));
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
            <DialogTitle>Filter Clients</DialogTitle>
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
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="groups-select-label">Groups</InputLabel>
                            <Select
                                labelId="groups-select-label"
                                id="groups-select"
                                multiple
                                value={filters.selectedGroups}
                                onChange={handleGroupChange}
                                input={<OutlinedInput id={"groups-select-label-input"} label="Groups"/>}
                                renderValue={(selected) =>
                                    selected
                                        .map((id) => {
                                            const group = groups.find((g) => String(g.id) === id);
                                            return group ? `${group.day} - ${group.hour}` : '';
                                        })
                                        .join(', ')
                                }
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {groups.map((g) => (
                                    <MenuItem key={g.id} value={String(g.id)}>
                                        <Checkbox checked={filters.selectedGroups.includes(String(g.id))}/>
                                        <ListItemText primary={`${g.day} - ${g.hour}`}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
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

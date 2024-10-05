import {Checkbox, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent} from "@mui/material";
import React, {useEffect, useState} from "react";
import {BranchModel} from "../models/branchModel";
import {fetchBranchesList} from "../../utils/utils";

interface BranchSelectorProps {
    id: string,
    labelId: string,
    filters: any,
    handleBranchChange: (event: SelectChangeEvent<string[]>) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({id, labelId, filters, handleBranchChange}) => {
    const [branches, setBranches] = useState<Array<BranchModel>>([]);

    useEffect(() => {
        fetchBranchesList().then(r => setBranches(r));
    }, [])

    return (
        <Select
            labelId={labelId}
            id={id}
            multiple
            value={filters.branches}
            onChange={handleBranchChange}
            input={<OutlinedInput id={labelId} label="Branches"/>}
            renderValue={(selected) => selected.join(', \n')}
            MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                    },
                },
            }}
        >
            {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.branchName}>
                    <Checkbox checked={filters.branches.includes(branch.branchName)}/>
                    <ListItemText primary={branch.branchName}/>
                </MenuItem>
            ))}
        </Select>);
}

export default BranchSelector;
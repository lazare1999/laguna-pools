import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, List, ListItem, ListItemText, Snackbar, TextField, Typography} from '@mui/material';
import {BranchModel} from "../../models/branchModel";
import authClient from "../../../api/api";
import {HttpMethod} from "../../../utils/httpMethodEnum";
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import Divider from "@mui/material/Divider";

const BranchesControlPage: React.FC = () => {
    const [branches, setBranches] = useState<Array<BranchModel>>([]);
    const [branchName, setBranchName] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<"info" | "success" | "error" | "warning" | undefined>("info");

    const fetchBranches = async () => {
        try {
            const response = await authClient.request('admin/list_branches', HttpMethod.GET);
            console.log(response)
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    // Handle adding a new branch
    const handleAddBranch = async () => {
        try {
            const response = await authClient.request(`admin/add_branch?branchName=${branchName}`, HttpMethod.POST);
            setAlertMessage(response.data);
            setAlertOpen(true);
            setSeverity("success");
            setBranchName('');
            fetchBranches().then(r => r);
        } catch (error) {
            console.error('Error adding branch:', error);
            setBranchName('Failed to add branch');
            setSeverity("error");
            setAlertOpen(true);
        }
    };

    useEffect(() => {
        fetchBranches().then(r => r);
    }, []);

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    return (
        <div>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2}}>
                <TextField
                    label="New Branch Name"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    margin="normal"
                    sx={{flexGrow: 1, height: 64}}
                />
                <Button
                    id={"branches-add-id"}
                    variant="contained"
                    color="primary"
                    onClick={handleAddBranch}
                    sx={{
                        ml: 2,
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <AddBusinessOutlinedIcon/>
                </Button>
            </Box>

            <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', color: '#3f51b5'}}>
                Branches List
            </Typography>
            <Divider sx={{marginBottom: 2}}/>

            <List sx={{bgcolor: '#f9f9f9', borderRadius: 1, padding: 2}}>
                {branches.map((branch) => (
                    <ListItem
                        key={branch.id}
                        sx={{
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            marginBottom: 1,
                            bgcolor: '#fff',
                            boxShadow: 1,
                            transition: '0.3s',
                            '&:hover': {
                                bgcolor: '#e3f2fd',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            }
                        }}
                    >
                        <ListItemText
                            primary={branch.branchName}
                            secondary={`Users: ${branch.usersCount}, Clients: ${branch.clientsCount}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseAlert} severity={severity}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default BranchesControlPage;

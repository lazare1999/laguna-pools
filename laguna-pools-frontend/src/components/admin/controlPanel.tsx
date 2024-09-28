import React from 'react';
import {Grid} from '@mui/material';
import {ListAlt, PersonAddAlt} from '@mui/icons-material';
import PoolIcon from '@mui/icons-material/Pool';
import {Component} from "../../utils/componentsEnum";
import CardComponent from "./card";

interface AdminControlPanelProps {
    selectHandler: (select: Component) => void;
}

const AdminControlPanel: React.FC<AdminControlPanelProps> = ({selectHandler}) => {
    const moveBackHandler = () => selectHandler(Component.CONTROL_PANEL);

    return (
        <div className="App">
            <Grid container spacing={3} style={{padding: '20px'}}>
                <CardComponent
                    label="Register New Operator"
                    onButtonClick={() => selectHandler(Component.REGISTER)}>
                    <PersonAddAlt style={{fontSize: 50, color: '#1976d2'}}/>
                </CardComponent>

                <CardComponent
                    label="List Active Operators"
                    onButtonClick={() => selectHandler(Component.ACTIVE_USERS_TABLE)}>
                    <ListAlt style={{fontSize: 50, color: '#43a047'}}/>
                </CardComponent>

                <CardComponent
                    label="Manage Branches"
                    onButtonClick={() => selectHandler(Component.MANAGE_BRANCHES)}>
                    <PoolIcon style={{fontSize: 50, color: '#f57c00'}}/>
                </CardComponent>

            </Grid>
        </div>
    );
};

export default AdminControlPanel;
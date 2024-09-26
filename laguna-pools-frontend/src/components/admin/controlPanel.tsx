import React from 'react';
import {Box} from '@mui/material';
import CardComponent from "./card";
import {Component} from "../../utils/componentsEnum";

// URLs for card backgrounds
const operatorImage = 'https://via.placeholder.com/300?text=Add+Operator';
const listImage = 'https://via.placeholder.com/300?text=List+Operators';
const manageImage = 'https://via.placeholder.com/300?text=Manage+Branches';

interface ControlPanelProps {
    selectHandler: (select: Component) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({selectHandler}) => {
    const handleAddOperator = () => {
        selectHandler(Component.REGISTER)
    };

    const handleListOperators = () => {
        selectHandler(Component.ACTIVE_USERS_TABLE);
    };

    const handleManageBranches = () => {
        console.log('Manage Branches');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0',
            }}
        >
            <CardComponent
                title="Add New Operator"
                buttonText="Go to Form"
                backgroundImage={operatorImage}
                onButtonClick={handleAddOperator}
            />
            <CardComponent
                title="List All Operators"
                buttonText="View Operators"
                backgroundImage={listImage}
                onButtonClick={handleListOperators}
            />
            <CardComponent
                title="Manage Branches"
                buttonText="Manage Now"
                backgroundImage={manageImage}
                onButtonClick={handleManageBranches}
            />
        </Box>
    );
};

export default ControlPanel;

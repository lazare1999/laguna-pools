import React from 'react';
import {Box} from '@mui/material';
import CardComponent from "./card";
import {Component} from "../../utils/componentsEnum";
import op from "../../assets/op.webp"
import listImage from "../../assets/op.webp"
import manageImage from "../../assets/op.webp"

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
        selectHandler(Component.MANAGE_BRANCHES);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <CardComponent
                title="Add New Operator"
                buttonText="Go to Form"
                backgroundImage={op}
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

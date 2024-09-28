import React from 'react';
import {Box, Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface MoveBackWrapperProps {
    onBack: () => void;
    children: React.ReactNode;
}

const MoveBackWrapper: React.FC<MoveBackWrapperProps> = ({onBack, children}) => {
    return (
        <Box sx={{position: 'relative', padding: '16px'}}>
            <Button
                variant="outlined"
                color="primary"
                onClick={onBack}
                startIcon={<ArrowBackIcon/>}
                sx={{position: 'absolute', top: '16px', left: '16px'}}
            >
                Move Back
            </Button>
            <Box sx={{marginTop: '30px'}}>{children}</Box>
        </Box>
    );
};

export default MoveBackWrapper;
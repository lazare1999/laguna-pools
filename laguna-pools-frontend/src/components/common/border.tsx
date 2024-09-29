import React from 'react';
import {Box} from '@mui/material';

interface BoxWrapperProps {
    children: React.ReactNode;
    padding?: string;
    borderRadius?: string;
    boxShadow?: string;
    borderColor?: string;
}

const BoxWrapper: React.FC<BoxWrapperProps> = ({
                                                   children,
                                                   padding = '2rem',
                                                   borderRadius = '10px',
                                                   boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                   borderColor = '#ccc',
                                               }) => {
    return (
        <Box
            sx={{
                padding,
                borderRadius,
                boxShadow,
                border: `1px solid ${borderColor}`,
                backgroundColor: '#fff',
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                marginTop: "5%",
            }}
        >
            {children}
        </Box>
    );
};

export default BoxWrapper;
import React from 'react';
import {Box, LinearProgress, Typography} from '@mui/material';

interface LoadingPageProps {
    label: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({label}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80%',
                width: '100%',
                textAlign: 'center',
                p: 2,
            }}
        >
            <Typography variant="h4" sx={{mb: 2, color: '#00796b'}}>
                {label}
            </Typography>
            <LinearProgress
                sx={{
                    width: '40%',
                    height: 7,
                    borderRadius: 5,
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#0067a1',
                    },
                }}
            />
        </Box>
    );
};

export default LoadingPage;
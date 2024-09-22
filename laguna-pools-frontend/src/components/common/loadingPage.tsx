import React from 'react';
import {Box, LinearProgress, Typography} from '@mui/material';

const LoadingPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f4f8', // Light background color
                textAlign: 'center',
                p: 2,
            }}
        >
            <Typography variant="h4" sx={{mb: 4, color: '#00796b'}}>
                Please wait while we load your page...
            </Typography>
            <LinearProgress
                sx={{
                    width: '60%',
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#d3d3d3',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#0067a1',
                    },
                }}
            />
        </Box>
    );
};

export default LoadingPage;
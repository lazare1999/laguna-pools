import React from 'react';
import {Card, CardContent, Grid, IconButton, Typography} from '@mui/material';
import {styled} from '@mui/system';
import {keyframes} from '@emotion/react';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const StyledCard = styled(Card)`
    animation: ${fadeIn} 0.5s ease-in-out;

    &:hover {
        transform: scale(1.05);
        transition: transform 0.3s;
    }
`;

interface CardComponentProps {
    label: string;
    onButtonClick: () => void;
}

const CardComponent: React.FC<React.PropsWithChildren<CardComponentProps>> = ({
                                                                                  label,
                                                                                  onButtonClick,
                                                                                  children
                                                                              }) => {
    return (
        <Grid item xs={12} md={4}>
            <StyledCard>
                <CardContent onClick={onButtonClick}>
                    <IconButton>
                        {children}
                    </IconButton>
                    <Typography variant="h6">{label}</Typography>
                </CardContent>
            </StyledCard>
        </Grid>
    );
};

export default CardComponent;
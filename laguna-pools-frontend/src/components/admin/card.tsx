import React from 'react';
import {CardContent, Grid, IconButton, Typography} from '@mui/material';
import StyledCard from "../common/animations";

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
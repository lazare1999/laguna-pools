import React from 'react';
import {Button, Card, CardContent, Typography} from '@mui/material';
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

interface StyledCardProps {
    title: string;
    buttonText: string;
    backgroundImage: string;
    onButtonClick: () => void;
}

const StyledCard = styled(Card)<{ backgroundImage: string }>`
    animation: ${fadeIn} 0.5s ease-in-out;
    margin: 20px;
    width: 15%;
    height: 30%;
    text-align: center;
    background-image: url(${(props) => props.backgroundImage});
    background-size: cover;
    background-position: center;

    &:hover {
        transform: scale(1.05);
        transition: transform 0.3s;
    }
`;

const CardComponent: React.FC<StyledCardProps> = ({
                                                      title, buttonText, backgroundImage, onButtonClick,
                                                  }) => {
    return (
        <StyledCard backgroundImage={backgroundImage}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Button variant="contained" color="primary" sx={{mt: 2}} onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </CardContent>
        </StyledCard>
    );
};

export default CardComponent;
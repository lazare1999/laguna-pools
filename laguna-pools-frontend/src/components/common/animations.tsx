import {keyframes} from "@emotion/react";
import {styled} from "@mui/system";
import {Card} from "@mui/material";

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

export default StyledCard;
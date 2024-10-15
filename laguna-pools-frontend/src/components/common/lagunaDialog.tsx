import {DialogTitle} from "@mui/material";
import {styled} from "@mui/system";


const CustomDialogTitle = styled(DialogTitle)(({theme}) => ({
    color: theme.palette.common.white,
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    marginBottom: 3
}));

export default CustomDialogTitle;
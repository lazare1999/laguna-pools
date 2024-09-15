import React from 'react';
import {AppBar, Box, Button, Grid, Toolbar, Typography} from '@mui/material';

interface TopMenuProps {
    select: number;
    selectHandler: (value: number) => void;
}

const TopMenu: React.FC<TopMenuProps> = ({select, selectHandler}) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container alignItems="center">
                    <Grid item xs={2}>
                        <Box>
                            <Button color="inherit" onClick={() => selectHandler(0)}>Login</Button>
                            <Button color="inherit" onClick={() => selectHandler(1)}>Sign Up</Button>
                        </Box>
                    </Grid>

                    <Grid item xs={8} container justifyContent="center">
                        <Typography variant="h6" component="div">
                            {select === 0 ? "Login" : "Add New User"}
                        </Typography>
                    </Grid>

                    <Grid item xs={2}/>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default TopMenu;
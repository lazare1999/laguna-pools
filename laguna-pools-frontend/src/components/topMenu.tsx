import React, {useEffect, useState} from 'react';
import {AppBar, Box, Button, Grid, Toolbar, Typography} from '@mui/material';
import {LOCAL_STORAGE_NAME} from "../utils/constants";
import {Component} from "../utils/componentsEnum";
import componentNameMapper from "../utils/componentNameMapper";

interface TopMenuProps {
    select: number;
    selectHandler: (value: number) => void;
}

const TopMenu: React.FC<TopMenuProps> = ({select, selectHandler}) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem(LOCAL_STORAGE_NAME);
        setToken(storedToken);
    }, []);

    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container alignItems="center">
                    <Grid item xs={2}>
                        <Box>
                            {token !== "test_token" &&
                                <Button color="inherit" onClick={() => selectHandler(Component.LOGIN)}>Login</Button>}
                            {token !== "test_token" &&
                                <Button color="inherit" onClick={() => selectHandler(Component.REGISTER)}>Sign
                                    Up</Button>}
                            {token === "test_token" &&
                                <Button color="inherit" onClick={() => selectHandler(Component.TABLES)}>Tables</Button>}
                        </Box>
                    </Grid>

                    <Grid item xs={8} container justifyContent="center">
                        <Typography variant="h6" component="div">
                            {componentNameMapper(select)}
                        </Typography>
                    </Grid>

                    <Grid item xs={2}/>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default TopMenu;
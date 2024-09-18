import React, {useState} from 'react';
import {AppBar, Box, Button, Menu, MenuItem, Toolbar} from '@mui/material';
import {ExitToApp, PersonAddAlt, TableChart} from '@mui/icons-material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PeopleIcon from '@mui/icons-material/People';
import {Component} from '../utils/componentsEnum';
import {REFRESH_TOKEN_EXP_NAME, REFRESH_TOKEN_NAME} from "../utils/constants";

interface TopMenuProps {
    selectHandler: (value: number) => void;
}

const TopMenu: React.FC<TopMenuProps> = ({selectHandler}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logOutHandler = () => {
        localStorage.removeItem(REFRESH_TOKEN_NAME);
        localStorage.removeItem(REFRESH_TOKEN_EXP_NAME);
        console.log(`${REFRESH_TOKEN_NAME}: ${localStorage.getItem(REFRESH_TOKEN_NAME)}`);
        console.log(`${REFRESH_TOKEN_NAME} and ${REFRESH_TOKEN_EXP_NAME} removed!`);

        setTimeout(() => {
            selectHandler(Component.LOGIN);
        }, 5000);
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Button
                    aria-controls={open ? 'users-menu' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    color="inherit"
                    startIcon={<PeopleAltIcon/>}
                >
                    Users
                </Button>
                <Menu
                    id="users-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>
                        <Button color="inherit" startIcon={<PersonAddAlt/>}
                                onClick={() => selectHandler(Component.REGISTER)}>
                            New User
                        </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Button color="inherit" startIcon={<PeopleIcon/>}
                                onClick={() => selectHandler(Component.USERS_TABLE)}>Users List</Button>
                    </MenuItem>
                </Menu>
                <Button color="inherit" startIcon={<TableChart/>}
                        onClick={() => selectHandler(Component.CLIENTS_TABLE)}>
                    Tables
                </Button>
                <Box sx={{flexGrow: 1}}/>
                <Button
                    color="inherit"
                    startIcon={<ExitToApp/>}
                    onClick={() => logOutHandler()}
                >
                    Log out
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default TopMenu;
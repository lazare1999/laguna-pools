import React, {useEffect, useState} from 'react';
import {AppBar, Box, Button, Menu, MenuItem, Toolbar} from '@mui/material';
import {ExitToApp, PersonAddAlt, TableChart} from '@mui/icons-material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PeopleIcon from '@mui/icons-material/People';
import {Component} from '../utils/componentsEnum';
import {UserApiService} from "../api/userApiService";

interface TopMenuProps {
    selectHandler: (value: number) => void;
    onLogout: () => void;
}

const TopMenu: React.FC<TopMenuProps> = ({selectHandler, onLogout}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const open = Boolean(anchorEl);

    useEffect(() => {
        UserApiService.getRoles().then(r => {
            setRoles(r.data.roles);
        }).catch(err => console.error(err));

    }, []);

    const hasRole = (role: string) => {
        return roles.includes(role);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {hasRole("ROLE_LAGUNA_ADMIN") && <>
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
                                    onClick={() => selectHandler(Component.ACTIVE_USERS_TABLE)}>Users
                                List</Button>
                        </MenuItem>
                    </Menu>
                </>
                }
                <Button color="inherit" startIcon={<TableChart/>}
                        onClick={() => selectHandler(Component.CLIENTS_TABLE)}>
                    Tables
                </Button>
                <Box sx={{flexGrow: 1}}/>
                <Button
                    color="inherit"
                    startIcon={<ExitToApp/>}
                    onClick={onLogout}
                >
                    Log out
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default TopMenu;
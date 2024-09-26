import React, {useEffect, useState} from 'react';
import {AppBar, Box, Button, Toolbar} from '@mui/material';
import {ExitToApp} from '@mui/icons-material';
import {Component} from '../utils/componentsEnum';
import {UserApiService} from "../api/userApiService";
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PoolOutlinedIcon from '@mui/icons-material/PoolOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

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

    const handleClick = () => {
        selectHandler(Component.CONTROL_PANEL);
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
                        startIcon={<ManageAccountsOutlinedIcon/>}
                    >
                        Admin Panel
                    </Button>
                    {/*<Menu*/}
                    {/*    id="users-menu"*/}
                    {/*    anchorEl={anchorEl}*/}
                    {/*    open={open}*/}
                    {/*    onClose={handleClose}*/}
                    {/*>*/}
                    {/*    <MenuItem onClick={handleClose}>*/}
                    {/*        <Button color="inherit" startIcon={<PersonAddAlt/>}*/}
                    {/*                onClick={() => selectHandler(Component.REGISTER)}>*/}
                    {/*            New Operator*/}
                    {/*        </Button>*/}
                    {/*    </MenuItem>*/}
                    {/*    <MenuItem onClick={handleClose}>*/}
                    {/*        <Button color="inherit" startIcon={<PeopleIcon/>}*/}
                    {/*                onClick={() => selectHandler(Component.ACTIVE_USERS_TABLE)}>Operators</Button>*/}
                    {/*    </MenuItem>*/}
                    {/*</Menu>*/}
                </>
                }

                <Button color="inherit" startIcon={<PoolOutlinedIcon/>}
                        onClick={() => selectHandler(Component.CLIENTS_TABLE)}>
                    Clients
                </Button>

                <Button color="inherit" startIcon={<Diversity3OutlinedIcon/>}
                        onClick={() => selectHandler(Component.GROUPS)}>
                    Groups
                </Button>
                <Button color="inherit" startIcon={<CalendarMonthOutlinedIcon/>}
                        onClick={() => selectHandler(Component.DAYS)}>
                    Days
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
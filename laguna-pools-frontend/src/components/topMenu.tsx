import React, {useEffect, useState} from 'react';
import {AppBar, Box, Button, Toolbar} from '@mui/material';
import {ExitToApp} from '@mui/icons-material';
import {Component} from '../utils/componentsEnum';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PoolOutlinedIcon from '@mui/icons-material/PoolOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import {UserApiService} from "../api/userApiService";

interface TopMenuProps {
    selectHandler: (value: number) => void;
    onLogout: () => void;
}

const TopMenu: React.FC<TopMenuProps> = ({selectHandler, onLogout}) => {
    const [anchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [userRoles, setUserRoles] = useState<string[]>([]);

    const hasRole = (role: string) => {
        return userRoles.includes(role);
    };

    const handleClick = () => {
        selectHandler(Component.CONTROL_PANEL);
    };

    useEffect(() => {
        UserApiService.getRoles().then(r => {
            setUserRoles(r.data.roles);
        }).catch(err => console.error(err));
    }, []);

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
                    <Button color="inherit" startIcon={<CalendarMonthOutlinedIcon/>}
                            onClick={() => selectHandler(Component.DAYS)}>
                        Days
                    </Button>
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
import React, {useEffect, useState} from 'react';
import {AppBar, Box, Button, Toolbar} from '@mui/material';
import {ExitToApp} from '@mui/icons-material';
import {UserApiService} from "../api/userApiService";

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    roleRequired?: string;
}

interface TopMenuProps {
    menuItems: MenuItem[];
    onLogout: () => void;
}

const TopMenu: React.FC<TopMenuProps> = ({menuItems, onLogout}) => {
    const [userRoles, setUserRoles] = useState<string[]>([]);

    const hasRole = (role: string) => {
        return userRoles.includes(role);
    };

    useEffect(() => {
        UserApiService.getRoles()
            .then(r => {
                setUserRoles(r.data.roles);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <AppBar
            position="static"
            sx={{
                background: 'linear-gradient(to bottom, #3f43b5, #6f74d5)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
        >
            <Toolbar>
                {menuItems.map((item, index) => (
                    !item.roleRequired || hasRole(item.roleRequired) ? (
                        <Button
                            key={index}
                            color="inherit"
                            onClick={item.onClick}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                            startIcon={item.icon}
                        >
                            {item.label}
                        </Button>
                    ) : null
                ))}

                <Box sx={{flexGrow: 1}}/>
                <Button
                    color="inherit"
                    onClick={onLogout}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                >
                    <ExitToApp/>
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default TopMenu;

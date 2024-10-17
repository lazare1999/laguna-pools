import React, {useEffect, useState} from 'react';
import './App.css';
import ComponentMapper from "./utils/componentMapper";
import {Component} from "./utils/componentsEnum";
import {REFRESH_TOKEN_EXP_NAME, REFRESH_TOKEN_NAME} from "./utils/constants";
import TopMenu from "./components/topMenu";
import AuthenticateUtils from "./api/authenticateUtils";
import PasswordDialog from "./components/reLoginDialog";
import LoadingPageProgress from "./components/common/loadingPage";
import authClient from "./api/api";
import {HttpMethod} from "./utils/enums/httpMethodEnum";
import {createTheme, ThemeProvider} from "@mui/material";
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PoolOutlinedIcon from '@mui/icons-material/PoolOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';


const App = () => {
    const [select, setSelect] = useState<Component>(Component.LOGIN);
    const [openSessionWindow, setOpenSessionWindow] = useState(false);
    const [reLoginDialogOpen, setReLoginDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkLoginStatus = async () => {
        const token = await AuthenticateUtils.getJwtViaRefreshTokenFromLocalStorage();
        return token !== null;
    };

    useEffect(() => {
        checkLoginStatus().then(p => {
            setLoading(true);
            if (p) {
                setSelect(Component.CLIENTS_TABLE);
                setOpenSessionWindow(p);
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const tokenExpTime = localStorage.getItem(REFRESH_TOKEN_EXP_NAME);

            setSelect(prevSelect => {
                if (tokenExpTime !== null && prevSelect !== Component.LOGIN) {
                    const currentDate = new Date();
                    const tokenDate = new Date(Number(tokenExpTime));

                    const tokenExpired = currentDate > tokenDate;
                    if (tokenExpired) {
                        setReLoginDialogOpen(true);
                    }
                }
                return prevSelect; // Return the current value of select
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const closeDialogHandler = () => {
        setReLoginDialogOpen(false);
    }

    const selectHandler = (n: Component) => {
        setSelect(n);
    };

    const logOutHandler = async () => {
        try {
            await authClient.request('logout_from_system', HttpMethod.POST).then(r => {
                if (r.status === 200) {
                    localStorage.removeItem(REFRESH_TOKEN_NAME);
                    localStorage.removeItem(REFRESH_TOKEN_EXP_NAME);
                    setOpenSessionWindow(false);
                    setSelect(Component.LOGIN);
                }
            });
        } catch (error) {
            throw error;
        }
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#3f43b5',
            },
            secondary: {
                main: '#6f74d5'
            }
        },
    });

    const menuItems = [
        {
            label: 'Dashboard',
            icon: <ManageAccountsOutlinedIcon/>,
            onClick: () => selectHandler(Component.CONTROL_PANEL),
            roleRequired: 'ROLE_LAGUNA_ADMIN',
        },
        {
            label: 'Days',
            icon: <CalendarMonthOutlinedIcon/>,
            onClick: () => selectHandler(Component.DAYS),
            roleRequired: 'ROLE_LAGUNA_ADMIN',
        },
        {
            label: 'Clients',
            icon: <PoolOutlinedIcon/>,
            onClick: () => selectHandler(Component.CLIENTS_TABLE),
        },
        {
            label: 'Groups',
            icon: <Diversity3OutlinedIcon/>,
            onClick: () => selectHandler(Component.GROUPS),
        },
        {
            label: 'Finances',
            icon: <AccountBalanceOutlinedIcon/>,
            onClick: () => selectHandler(Component.ACCOUNTING),
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                {loading ?
                    <LoadingPageProgress label={"Please wait while we load your page..."}/> :
                    <>
                        <PasswordDialog onClose={closeDialogHandler} open={reLoginDialogOpen}
                                        setOpenSessionWindow={open => setOpenSessionWindow(open)}/>
                        {openSessionWindow &&
                            <TopMenu menuItems={menuItems} onLogout={logOutHandler}/>}
                        <ComponentMapper selectHandler={selectHandler}
                                         currentComponent={select}
                                         setOpenSessionWindow={setOpenSessionWindow}/>
                    </>}
            </div>
        </ThemeProvider>

    );
}

export default App;
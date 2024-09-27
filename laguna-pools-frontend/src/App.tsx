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
import {HttpMethod} from "./utils/httpMethodEnum";

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

    return (
        <div className="App">
            {loading ?
                <LoadingPageProgress label={"Please wait while we load your page..."}/> :
                <>
                    <PasswordDialog onClose={closeDialogHandler} open={reLoginDialogOpen}
                                    setOpenSessionWindow={open => setOpenSessionWindow(open)}/>
                    {openSessionWindow && <TopMenu selectHandler={selectHandler} onLogout={logOutHandler}/>}
                    <ComponentMapper selectHandler={selectHandler} currentComponent={select}
                                     setOpenSessionWindow={setOpenSessionWindow}/>
                </>}
        </div>
    );
}

export default App;
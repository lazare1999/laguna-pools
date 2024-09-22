import React, {useEffect, useState} from 'react';
import './App.css';
import ComponentMapper from "./utils/componentMapper";
import {Component} from "./utils/componentsEnum";
import {REFRESH_TOKEN_EXP_NAME, REFRESH_TOKEN_NAME} from "./utils/constants";
import TopMenu from "./components/topMenu";
import AuthenticateUtils from "./api/authenticateUtils";
import PasswordDialog from "./components/users/reLoginDialog";
import LoadingPageProgress from "./components/common/loadingPage";

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
            if (p) {
                setLoading(true);
                setSelect(Component.CLIENTS_TABLE);
                setOpenSessionWindow(p);
                setLoading(false);
            }
        })
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(REFRESH_TOKEN_EXP_NAME);

        if (token !== null && select !== Component.LOGIN) {
            const tokenDate = new Date(Number(token));
            const currentDate = new Date();

            console.log(`current: ${currentDate}\ntoken: ${tokenDate}\nres: ${currentDate > tokenDate}`);

            const tokenExpired = currentDate > tokenDate;
            if (tokenExpired) {
                setReLoginDialogOpen(true);
            }
        }
    }, [select]);

    const closeDialogHandler = () => {
        setReLoginDialogOpen(false);
    }

    const selectHandler = (n: Component) => {
        setSelect(n);
    };

    const logOutHandler = () => {
        localStorage.removeItem(REFRESH_TOKEN_NAME);
        localStorage.removeItem(REFRESH_TOKEN_EXP_NAME);
        setOpenSessionWindow(false);
        setSelect(Component.LOGIN);
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

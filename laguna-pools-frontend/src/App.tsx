import React, {useEffect, useState} from 'react';
import './App.css';
import ComponentMapper from "./utils/componentMapper";
import {Component} from "./utils/componentsEnum";
import {REFRESH_TOKEN_EXP_NAME, REFRESH_TOKEN_NAME, TOKEN_EXP_NAME} from "./utils/constants";
import TopMenu from "./components/topMenu";
import AuthenticateUtils from "./api/authenticateUtils";
import PasswordDialog from "./components/users/reLoginDialog";

const App = () => {
    const [select, setSelect] = useState<Component>(Component.LOGIN);
    const [openSessionWindow, setOpenSessionWindow] = useState(false);
    const [reLoginDialogOpen, setReLoginDialogOpen] = useState(false);

    const checkLoginStatus = async () => {
        const token = await AuthenticateUtils.getJwtViaRefreshTokenFromLocalStorage();
        return token !== null;
    };

    useEffect(() => {
        checkLoginStatus().then(p => {
            if (p) {
                setSelect(Component.CLIENTS_TABLE);
                setOpenSessionWindow(p);
            }
        })
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_EXP_NAME);

        if (token !== null) {  // Ensure the token is not null
            const tokenDate = new Date(token); // Convert token string to number and then to a Date
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
            <PasswordDialog onClose={closeDialogHandler} open={reLoginDialogOpen}
                            setOpenSessionWindow={open => setOpenSessionWindow(open)}/>
            {openSessionWindow && <TopMenu selectHandler={selectHandler} onLogout={logOutHandler}/>}
            <ComponentMapper selectHandler={selectHandler} currentComponent={select}
                             setOpenSessionWindow={setOpenSessionWindow}/>
        </div>
    );
}

export default App;

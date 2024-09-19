import React, {useEffect, useState} from 'react';
import './App.css';
import ComponentMapper from "./utils/componentMapper";
import {Component} from "./utils/componentsEnum";
import {REFRESH_TOKEN_EXP_NAME, REFRESH_TOKEN_NAME} from "./utils/constants";
import TopMenu from "./components/topMenu";
import AuthenticateUtils from "./api/authenticateUtils";

const App = () => {
    const expDate = localStorage.getItem(REFRESH_TOKEN_EXP_NAME);
    const expirationTime = expDate ? parseInt(expDate, 10) : null;
    const isLoggedIn = expirationTime !== null && expirationTime > Date.now();
    const [select, setSelect] = useState<Component>(isLoggedIn ? Component.CLIENTS_TABLE : Component.LOGIN);
    const [openSessionWindow, setOpenSessionWindow] = useState(false);
    
    useEffect(() => {
        console.log('Checking login status...'); // Updated log message
        const checkLoginStatus = async () => {
            const token = await AuthenticateUtils.getAccessToken();
            const isLoggedIn = token !== null;
            setOpenSessionWindow(isLoggedIn);
        };
        checkLoginStatus();
    }, []);


    const selectHandler = (n: Component) => {
        setSelect(n);
    };

    const logOutHandler = () => {
        localStorage.removeItem(REFRESH_TOKEN_NAME);
        localStorage.removeItem(REFRESH_TOKEN_EXP_NAME);
        setOpenSessionWindow(false); // Hide TopMenu
        setSelect(Component.LOGIN); // Navigate to login screen
    };

    return (
        <div className="App">
            {openSessionWindow && <TopMenu selectHandler={selectHandler} onLogout={logOutHandler}/>}
            <ComponentMapper selectHandler={selectHandler} componentIndex={select}
                             setOpenSessionWindow={setOpenSessionWindow}/>
        </div>
    );
}

export default App;

import React, {useEffect, useState} from 'react';
import './App.css';
import ComponentMapper from "./utils/componentMapper";
import {Component} from "./utils/componentsEnum";
import {REFRESH_TOKEN_EXP_NAME, REFRESH_TOKEN_NAME} from "./utils/constants";
import TopMenu from "./components/topMenu";
import AuthenticateUtils from "./api/authenticateUtils";

const App = () => {
    const [select, setSelect] = useState<Component>(Component.LOGIN);
    const [openSessionWindow, setOpenSessionWindow] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AuthenticateUtils.getJwtViaRefreshTokenFromLocalStorage();
            const isLoggedIn = token !== null;
            setOpenSessionWindow(isLoggedIn);
        };
        checkLoginStatus().then(r => r);
    }, []);

    useEffect(() => {
        
    }, [select])


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
            <ComponentMapper selectHandler={selectHandler} currentComponent={select}
                             setOpenSessionWindow={setOpenSessionWindow}/>
        </div>
    );
}

export default App;

import React, {useEffect, useState} from 'react';
import './App.css';
import ComponentMapper from "./utils/componentMapper";
import {Component} from "./utils/componentsEnum";
import {REFRESH_TOKEN_EXP_NAME} from "./utils/constants";
import TopMenu from "./components/topMenu";

const App = () => {
    const expDate = localStorage.getItem(REFRESH_TOKEN_EXP_NAME);
    const expirationTime = expDate ? parseInt(expDate, 10) : null;
    const isLoggedIn = expirationTime !== null && expirationTime > Date.now();
    const [select, setSelect] = useState<Component>(isLoggedIn ? Component.CLIENTS_TABLE : Component.LOGIN);
    const [openSessionWindow, setOpenSessionWindow] = useState(false);

    useEffect(() => {
        const expDate = localStorage.getItem(REFRESH_TOKEN_EXP_NAME);
        const expirationTime = expDate ? parseInt(expDate, 10) : null;
        const isLoggedIn = expirationTime !== null && expirationTime > Date.now();
        setOpenSessionWindow(isLoggedIn);
    }, [select])


    const selectHandler = (n: Component) => {
        setSelect(n);
    };

    return (
        <div className="App">
            {openSessionWindow && <TopMenu selectHandler={selectHandler}/>}
            <ComponentMapper selectHandler={selectHandler} componentIndex={select}/>
        </div>
    );
}

export default App;

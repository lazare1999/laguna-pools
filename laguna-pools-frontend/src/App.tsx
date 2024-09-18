import React, {useEffect, useState} from 'react';
import './App.css';
import ComponentMapper from "./utils/componentMapper";
import {Component} from "./utils/componentsEnum";
import {LOCAL_STORAGE_NAME} from "./utils/constants";
import TopMenu from "./components/topMenu";

const App = () => {
    const [select, setSelect] = useState<Component>(Component.LOGIN);
    const [openSessionWindow, setOpenSessionWindow] = useState(false);

    useEffect(() => {
        const expDate = localStorage.getItem("refresh_token_expires_in");
        const expirationTime = expDate ? parseInt(expDate, 10) : null;
        const isLoggedIn = expirationTime !== null && expirationTime > Date.now();
        setOpenSessionWindow(isLoggedIn);
    }, [select])

    useState(() =>
        setSelect(
            localStorage.getItem(LOCAL_STORAGE_NAME) == "test_token" ? Component.CLIENTS_TABLE : Component.LOGIN)
    );

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

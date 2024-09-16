import React, {useState} from 'react';
import './App.css';
import ComponentMapper from "./utils/componentMapper";
import {Component} from "./utils/componentsEnum";
import {LOCAL_STORAGE_NAME} from "./utils/constants";
import isSignedIn from "./utils/genericUtils";
import TopMenu from "./components/topMenu";

const App = () => {
    const [select, setSelect] = useState<Component>(Component.LOGIN);

    useState(() =>
        setSelect(
            localStorage.getItem(LOCAL_STORAGE_NAME) == "test_token" ? Component.TABLES : Component.LOGIN)
    );

    const selectHandler = (n: Component) => {
        setSelect(n);
    };

    return (
        <div className="App">
            {isSignedIn() && <TopMenu selectHandler={selectHandler}/>}
            <ComponentMapper selectHandler={selectHandler} componentIndex={select}/>
        </div>
    );
}

export default App;

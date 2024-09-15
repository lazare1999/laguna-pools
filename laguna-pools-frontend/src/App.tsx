import React, {useState} from 'react';
import './App.css';
import RegisterForm from "./components/register";
import TopMenu from "./components/topMenu";
import LoginForm from "./components/login";

function App() {
    const [select, setSelect] = useState(0);

    const selectHandler = (n: number) => {
        setSelect(n);
    }

    // let token;
    // useEffect(
    //     () => {
    //         token = localStorage.getItem("laguna_token") || "";
    //     }
    // );

    return (
        <div className="App">
            <TopMenu select={select} selectHandler={selectHandler}/>
            {select == 0 ? <LoginForm/> : <RegisterForm/>}
        </div>
    );
}

export default App;

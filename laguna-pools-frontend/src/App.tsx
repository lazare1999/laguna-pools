import React, {useEffect} from 'react';
import './App.css';
import LoginForm from "./components/login";

function App() {
    let token;
    useEffect(
        () => {
            token = localStorage.getItem("laguna_token") || "";
        }
    );
    return (
        <div className="App">
            {token == "" ? <p>MainPage</p> : <LoginForm/>}
        </div>
    );
}

export default App;

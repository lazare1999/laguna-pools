import Login from "../components/login";
import RegisterForm from "../components/users/register";
import ClientsTable from "../components/clients/clientsTable";
import React from "react";
import {Component} from "./componentsEnum";
import UsersTable from "../components/users/usersTable";

interface ComponentMapperProps {
    currentComponent: Component
    selectHandler: (selectHandler: Component) => void;
    setOpenSessionWindow: (open: boolean) => void;
}

const ComponentMapper: React.FC<ComponentMapperProps> = ({currentComponent, selectHandler, setOpenSessionWindow}) => {
    switch (currentComponent) {
        case Component.LOGIN:
            return <Login selectHandler={selectHandler} setOpenSessionWindow={setOpenSessionWindow}/>;
        case Component.REGISTER:
            return <RegisterForm/>;
        case Component.CLIENTS_TABLE:
            return <ClientsTable/>;
        case Component.USERS_TABLE:
            return <UsersTable/>
        default:
            return null;
    }
};

export default ComponentMapper;
import Login from "../components/login";
import RegisterForm from "../components/register";
import ClientsTable from "../components/clientsTable";
import React from "react";
import {Component} from "./componentsEnum";
import UsersTable from "../components/usersTable";

interface ComponentMapperProps {
    componentIndex: Component
    selectHandler: (selectHandler: Component) => void;
}

const ComponentMapper: React.FC<ComponentMapperProps> = ({componentIndex, selectHandler}) => {
    switch (componentIndex) {
        case Component.LOGIN:
            return <Login selectHandler={selectHandler}/>;
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
import Login from "../components/login";
import RegisterForm from "../components/register";
import ClientsTable from "../components/tables";
import React from "react";
import {Component} from "./componentsEnum";

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
        case Component.TABLES:
            return <ClientsTable/>;
        default:
            return null;
    }
};

export default ComponentMapper;
import Login from "../components/login";
import RegisterForm from "../components/register";
import ClientsTable from "../components/clients/clientsTable";
import React from "react";
import {Component} from "./componentsEnum";
import ActiveUsersTable from "../components/users/activeUsersTable";
import ControlPanel from "../components/admin/controlPanel";

interface ComponentMapperProps {
    currentComponent: Component
    selectHandler: (select: Component) => void;
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
        case Component.ACTIVE_USERS_TABLE:
            return <ActiveUsersTable/>
        case Component.CONTROL_PANEL:
            return <ControlPanel selectHandler={selectHandler}/>
        default:
            return null;
    }
};

export default ComponentMapper;
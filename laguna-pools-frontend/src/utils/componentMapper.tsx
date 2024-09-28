import Login from "../components/login";
import RegisterForm from "../components/admin/register";
import ClientsTable from "../components/clients/clientsTable";
import React from "react";
import {Component} from "./componentsEnum";
import ActiveUsersTable from "../components/admin/users/activeUsersTable";
import AdminControlPanel from "../components/admin/controlPanel";
import BranchesControlPage from "../components/admin/branches/branchesControlPage";
import MoveBackWrapper from "../components/admin/moveBack";

interface ComponentMapperProps {
    currentComponent: Component
    selectHandler: (select: Component) => void;
    setOpenSessionWindow: (open: boolean) => void;
}

const ComponentMapper: React.FC<ComponentMapperProps> = ({
                                                             currentComponent,
                                                             selectHandler,
                                                             setOpenSessionWindow
                                                         }) => {
    const moveToControlPanel = () => selectHandler(Component.CONTROL_PANEL);

    switch (currentComponent) {
        case Component.LOGIN:
            return <Login selectHandler={selectHandler} setOpenSessionWindow={setOpenSessionWindow}/>;
        case Component.REGISTER:
            return <MoveBackWrapper onBack={moveToControlPanel}><RegisterForm/></MoveBackWrapper>;
        case Component.CLIENTS_TABLE:
            return <ClientsTable/>;
        case Component.ACTIVE_USERS_TABLE:
            return <MoveBackWrapper onBack={moveToControlPanel}><ActiveUsersTable/></MoveBackWrapper>
        case Component.CONTROL_PANEL:
            return <AdminControlPanel selectHandler={selectHandler}/>
        case Component.MANAGE_BRANCHES:
            return <MoveBackWrapper onBack={moveToControlPanel}><BranchesControlPage/></MoveBackWrapper>
        default:
            return null;
    }
};

export default ComponentMapper;
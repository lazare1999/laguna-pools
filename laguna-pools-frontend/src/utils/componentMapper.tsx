import Login from "../components/login";
import RegisterForm from "../components/admin/register";
import ClientsTable from "../components/clients/clientsTable";
import React from "react";
import {Component} from "./componentsEnum";
import ActiveUsersTable from "../components/admin/users/activeUsersTable";
import AdminControlPanel from "../components/admin/controlPanel";
import BranchesControlPage from "../components/admin/branches/branchesControlPage";
import MoveBackWrapper from "../components/admin/moveBack";
import {TargetView} from "../components/models/targetViewModel";
import {BranchModel} from "../components/models/branchModel";

interface ComponentMapperProps {
    currentComponent: Component
    selectHandler: (select: Component) => void;
    setOpenSessionWindow: (open: boolean) => void;
    userRoles: string[];
    branches: Array<BranchModel>;
    roles: Array<TargetView>;
}

const ComponentMapper: React.FC<ComponentMapperProps> = ({
                                                             currentComponent,
                                                             selectHandler,
                                                             setOpenSessionWindow,
                                                             userRoles,
                                                             branches,
                                                             roles,
                                                         }) => {
    const moveToControlPanel = () => selectHandler(Component.CONTROL_PANEL);

    switch (currentComponent) {
        case Component.LOGIN:
            return <Login selectHandler={selectHandler} setOpenSessionWindow={setOpenSessionWindow}/>;
        case Component.REGISTER:
            return <MoveBackWrapper onBack={moveToControlPanel}><RegisterForm branches={branches}
                                                                              roles={roles}/></MoveBackWrapper>;
        case Component.CLIENTS_TABLE:
            return <ClientsTable userRoles={userRoles} branches={branches}/>;
        case Component.ACTIVE_USERS_TABLE:
            return <MoveBackWrapper onBack={moveToControlPanel}><ActiveUsersTable branches={branches}
                                                                                  roles={roles}/></MoveBackWrapper>
        case Component.CONTROL_PANEL:
            return <AdminControlPanel selectHandler={selectHandler}/>
        case Component.MANAGE_BRANCHES:
            return <MoveBackWrapper onBack={moveToControlPanel}><BranchesControlPage/></MoveBackWrapper>
        default:
            return null;
    }
};

export default ComponentMapper;
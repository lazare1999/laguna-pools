import Login from "../components/login";
import RegisterForm from "../components/admin/register";
import ClientsTable from "../components/clients/clientsTable";
import React from "react";
import {Component} from "./componentsEnum";
import ActiveUsersTable from "../components/admin/users/activeUsersTable";
import AdminControlPanel from "../components/admin/controlPanel";
import BranchesControlPage from "../components/admin/branches/branchesControlPage";
import MoveBackWrapper from "../components/admin/moveBack";
import GroupScheduleTable from "../components/clients/groups/groupScheduleTable";
import DaysTable from "../components/days/daysTable";

interface ComponentMapperProps {
    currentComponent: Component
    selectHandler: (select: Component) => void;
    setOpenSessionWindow: (open: boolean) => void;
    branchesHandler: (branches: string[]) => void;
}

const ComponentMapper: React.FC<ComponentMapperProps> = ({
                                                             currentComponent,
                                                             selectHandler,
                                                             setOpenSessionWindow,
                                                             branchesHandler
                                                         }) => {
    const moveToControlPanel = () => selectHandler(Component.CONTROL_PANEL);

    switch (currentComponent) {
        case Component.LOGIN:
            return <Login selectHandler={selectHandler} setOpenSessionWindow={setOpenSessionWindow}
                          branchesHandler={branchesHandler}/>;
        case Component.REGISTER:
            return <MoveBackWrapper onBack={moveToControlPanel}><RegisterForm/></MoveBackWrapper>;
        case Component.CLIENTS_TABLE:
            return <ClientsTable/>;
        case Component.GROUPS:
            return <GroupScheduleTable/>;
        case Component.ACTIVE_USERS_TABLE:
            return <MoveBackWrapper onBack={moveToControlPanel}><ActiveUsersTable/></MoveBackWrapper>
        case Component.CONTROL_PANEL:
            return <AdminControlPanel selectHandler={selectHandler}/>
        case Component.MANAGE_BRANCHES:
            return <MoveBackWrapper onBack={moveToControlPanel}><BranchesControlPage/></MoveBackWrapper>
        case Component.DAYS:
            return <DaysTable/>
        default:
            return null;
    }
};

export default ComponentMapper;
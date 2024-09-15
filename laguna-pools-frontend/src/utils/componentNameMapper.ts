import {Component} from "./componentsEnum";

const componentNameMapper = (component: Component) => {
    switch (component) {
        case Component.LOGIN:
            return "Login";
        case Component.REGISTER:
            return "Register";
        case Component.TABLES:
            return "Tables";
        default:
            return null;
    }
};

export default componentNameMapper;
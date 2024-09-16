import axios from "axios";
import {LOCAL_STORAGE_NAME} from '../utils/constants';
// const apiClient = axios.create({baseURL: "/api"});
const authClient = axios.create({
    baseURL: "http://localhost:8080/authenticate"
});

const requestHeader = () => {
    const jwt = localStorage.getItem("laguna_token") || "";
    return {headers: {'Authorization': `Bearer ${jwt}`}};
};

class Api {
    static login = (request: { username: string; password: string }) => {
        localStorage.setItem(LOCAL_STORAGE_NAME, "test_token");
        // return authClient.post(
        //     "",
        //     {
        //         username: request.username,
        //         password: request.password,
        //     },
        //     requestHeader()
        // )
    };

    static register = (request: { username: string; password: string }) => {

    }
}

export default Api;

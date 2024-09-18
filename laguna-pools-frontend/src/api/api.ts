import axios from "axios";
import {LOCAL_STORAGE_NAME} from "../utils/constants";

const authClient = axios.create({
    baseURL: "https://laguna.lazarekvirtia.com/api/",
});

const requestHeader = () => {
    const jwt = localStorage.getItem(LOCAL_STORAGE_NAME) || "";
    return {headers: {Authorization: `Bearer ${jwt}`}};
};

class Api {
    static login = async (request: { username: string; password: string }) => {
        return localStorage.setItem(LOCAL_STORAGE_NAME, "test_token");
        // return authClient.post(
        //     "",
        //     {
        //         username: request.username,
        //         password: request.password,
        //     },
        //     requestHeader()
        // );
    };

}

export default Api;

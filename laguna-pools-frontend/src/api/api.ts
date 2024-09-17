import axios from "axios";
import {LOCAL_STORAGE_NAME} from "../utils/constants";

const authClient = axios.create({
    baseURL: "http://backend:8080",
});

const requestHeader = () => {
    const jwt = localStorage.getItem(LOCAL_STORAGE_NAME) || "";
    return {headers: {Authorization: `Bearer ${jwt}`}};
};

class Api {

}

export default Api;

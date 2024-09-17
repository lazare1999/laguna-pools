import axios from "axios";
import {LOCAL_STORAGE_NAME} from "../utils/constants";

const authClient = axios.create({
    baseURL: "backend:8080/authenticate",
});

const requestHeader = () => {
    const jwt = localStorage.getItem(LOCAL_STORAGE_NAME) || "";
    return {headers: {Authorization: `Bearer ${jwt}`}};
};

class Api {

}

export default Api;

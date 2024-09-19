import axios from "axios";
import AuthenticateUtils from "./authenticateUtils";
import {API_BASE_URL} from "../config";

const requestHeader = () => {
    const jwt = AuthenticateUtils.getAccessToken();
    return {Authorization: `Bearer ${jwt}`};
};

const authClient = axios.create({
    baseURL: API_BASE_URL,
    headers: requestHeader()
});

export default authClient;
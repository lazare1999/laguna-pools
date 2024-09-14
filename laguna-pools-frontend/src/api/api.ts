import axios from "axios";

const apiClient = axios.create({baseURL: "/api"});
const authClient = axios.create({baseURL: "/authenticate"});

const requestHeader = () => {
    const jwt = localStorage.getItem("laguna_token") || "";
    return {headers: {'Authorization': `Bearer ${jwt}`}};
};

class Api {
    static login = (request: { username: string; password: string }) => {
        return authClient.post(
            "",
            {
                username: request.username,
                password: request.password,
            },
            requestHeader()
        );
    };
}

export default Api;

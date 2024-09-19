import axios from "axios";
import AuthenticateUtils from "./authenticateUtils";
import {API_BASE_URL} from "../config";
import {HttpMethod} from "../utils/httpMethodEnum";

const createAuthClient = async () => {
    try {
        console.log("aaaaaaaaaaa")
        const jwt = await AuthenticateUtils.getAccessToken();

        return axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${jwt || ''}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    } catch (error) {
        console.error("Failed to create auth client:", error);
        throw error;
    }
};

class ApiService {

    static async request(endpoint: string, method: HttpMethod, data?: any): Promise<any> {
        try {
            const authClient = await createAuthClient();

            switch (method) {
                case HttpMethod.GET:
                    return await authClient.get(endpoint);
                case HttpMethod.POST:
                    return await authClient.post(endpoint, data);
                case HttpMethod.DELETE:
                    return await authClient.delete(endpoint, {data});
            }
        } catch (error) {
            throw error;
        }
    }
}

export default ApiService;
import axios from "axios";
import AuthenticateUtils from "./authenticateUtils";
import {API_BASE_URL} from "../config";
import {HttpMethod} from "../utils/enums/httpMethodEnum";

const createAuthClient = async () => {
    try {
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
            let response;
            switch (method) {
                case HttpMethod.GET:
                    response = await authClient.get(endpoint);
                    break;
                case HttpMethod.POST:
                    response = await authClient.post(endpoint, data);
                    break;
                case HttpMethod.DELETE:
                    response = await authClient.delete(endpoint, {data});
                    break;
                default:
                    throw new Error("Wrong method!");
            }
            return response;
        } catch (error) {
            console.error("API request error: ", error);
            throw error;
        }
    }
}

export default ApiService;
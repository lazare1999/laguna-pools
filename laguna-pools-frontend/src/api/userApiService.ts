import ApiService from "./api";
import {HttpMethod} from "../utils/httpMethodEnum";

export class UserApiService {
    static async getRoles() {
        return ApiService.request("get_user_roles", HttpMethod.GET);
    }
}

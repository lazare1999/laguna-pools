import axios from "axios";
import {AuthenticationResponse} from "./authenticateResponse";
import {REFRESH_TOKEN_EXP_NAME, REFRESH_TOKEN_NAME} from "../utils/constants";
import {API_BASE_URL} from "../config";
import {encrypt} from "../utils/encryption";

const authClientForUtils = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

const auth = new AuthenticationResponse({
    jwt: "",
    expiresIn: 0,
    expiresAt: new Date(),
    refreshToken: "",
    refreshExpiresIn: 0,
    refreshExpiresAt: new Date()
});

const requestHeader = () => {
    const jwt = localStorage.getItem("laguna_token") || "";
    return {headers: {Authorization: `Bearer ${jwt}`}};
};

class AuthenticateUtils {
    static getJwtViaRefreshToken = async () => {
        try {
            const refreshToken = auth.refreshToken;

            const res = await authClientForUtils.post(
                `jwt_via_refresh_token`,
                {},
                {
                    params: {refreshToken},
                    ...requestHeader(),
                }
            );

            if (res.status !== 200) return null;

            await this.updateRefreshTokenLocal(res.data);
            return res.data.jwt;
        } catch (e) {
            return null;
        }
    };

    static getJwtViaRefreshTokenFromLocalStorage = async () => {

        const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME);
        const refreshTokenExpiresIn = localStorage.getItem(REFRESH_TOKEN_EXP_NAME);

        if (!refreshToken || !refreshTokenExpiresIn) return null;

        const expiresAt = new Date(Number(refreshTokenExpiresIn));
        if (new Date() > expiresAt) return null;

        try {
            const res = await authClientForUtils.post(
                `jwt_via_refresh_token`,
                {},
                {
                    params: {refreshToken},
                    ...requestHeader(),
                }
            );

            if (res.status !== 200) return null;

            await this.updateRefreshTokenLocal(res.data);
            return res.data.jwt;
        } catch (e) {
            return null;
        }
    };

    static getAccessToken = async () => {
        if (auth.jwt && new Date() < auth.expiresAt!) {
            return auth.jwt;
        }

        if (auth.refreshToken && new Date() < auth.refreshExpiresAt!) {
            return await this.getJwtViaRefreshToken();
        }

        return await this.getJwtViaRefreshTokenFromLocalStorage();
    };

    static authenticate = async (
        username: string,
        password: string,
    ) => {
        const encryptedUsername = encrypt(username);
        const encryptedPassword = encrypt(password);

        if (!encryptedUsername || !encryptedPassword) return "Encrypted data, IV, and key are required";

        try {
            await authClientForUtils.post(
                `authenticate?encryptedUsername=${encryptedUsername}&encryptedPassword=${encryptedPassword}`
            ).then(res => {
                localStorage.setItem("laguna_username", username);
                if (res.status === 200) {
                    this.updateRefreshTokenLocal(res.data);
                }
            });
        } catch (e: any) {
            if (e.response.status === 423) {
                return "User is locked. \n Contact administrator";
            } else if (e.response.status === 403) {
                return "Enter correct username and password";
            }

            return `Error: ${e}`;
        }
        return "Successfully authenticated";
    };


    static updateRefreshTokenLocal = async (res: any) => {
        auth.update(res);
        localStorage.setItem(REFRESH_TOKEN_NAME, auth.refreshToken!);
        localStorage.setItem(REFRESH_TOKEN_EXP_NAME, auth.refreshExpiresIn!.toString());
    };
}

export default AuthenticateUtils;

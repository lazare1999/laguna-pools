import axios from "axios";
import {AuthenticationResponse} from "./authenticateResponse";

const authClient = axios.create({
    baseURL: "http://localhost:8080/",
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

            const res = await authClient.post(
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
        const refreshToken = localStorage.getItem("refresh_token");
        const refreshTokenExpiresIn = localStorage.getItem("refresh_token_expires_in");

        if (!refreshToken || !refreshTokenExpiresIn) return null;

        const expiresAt = new Date(Number(refreshTokenExpiresIn));
        if (new Date() > expiresAt) return null;

        try {
            const res = await authClient.post(
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
        password: string
    ) => {
        if (!username || !password) return false;

        try {
            const res = await authClient.post(
                `authenticate/?username=${username}&password=${password}`,
                {}
            );

            localStorage.setItem("laguna_username", username);

            if (res.status === 200) {
                await this.updateRefreshTokenLocal(res.data);
                return true;
            }
        } catch (e) {
            return false;
        }

        return false;
    };

    static updateRefreshTokenLocal = async (res: any) => {
        auth.update(res);
        localStorage.setItem("refresh_token", auth.refreshToken!);
        localStorage.setItem("refresh_token_expires_in", auth.refreshExpiresIn!.toString());
    };
}

export default AuthenticateUtils;

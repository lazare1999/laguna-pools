export interface IAuthenticationResponse {
    jwt?: string;
    expiresIn?: number;
    expiresAt?: Date;
    refreshToken?: string;
    refreshExpiresIn?: number;
    refreshExpiresAt?: Date;
}

const authenticationResponseFromJson = (str: string): AuthenticationResponse => {
    const json = JSON.parse(str);
    return <AuthenticationResponse>AuthenticationResponse.fromJson(json);
};

const authenticationResponseToJson = (data: AuthenticationResponse): string => {
    return JSON.stringify(data.toJson());
};

export class AuthenticationResponse {
    jwt?: string;
    expiresIn?: number;
    expiresAt?: Date;
    refreshToken?: string;
    refreshExpiresIn?: number;
    refreshExpiresAt?: Date;

    constructor(data: IAuthenticationResponse) {
        this.jwt = data.jwt;
        this.expiresIn = data.expiresIn;
        this.expiresAt = data.expiresAt;
        this.refreshToken = data.refreshToken;
        this.refreshExpiresIn = data.refreshExpiresIn;
        this.refreshExpiresAt = data.refreshExpiresAt;
    }

    static fromJson(json: any): IAuthenticationResponse {
        return {
            jwt: json.jwt,
            expiresIn: json.expiresIn,
            refreshToken: json.refreshToken,
            refreshExpiresIn: json.refreshExpiresIn,
        };
    }

    toJson(): Record<string, any> {
        return {
            jwt: this.jwt,
            expiresIn: this.expiresIn,
            refreshToken: this.refreshToken,
            refreshExpiresIn: this.refreshExpiresIn,
        };
    }

    update(body: any): void {
        if (!body) {
            return;
        }

        if (body.hasOwnProperty("jwt")) {
            this.jwt = body.jwt;
        }

        if (body.hasOwnProperty("refreshToken")) {
            this.refreshToken = body.refreshToken;
        }

        if (body.hasOwnProperty("expiresIn")) {
            this.expiresIn = this.isInteger(body.expiresIn) ? body.expiresIn : parseInt(body.expiresIn, 10);
            this.expiresAt = new Date(Date.now() + this.expiresIn! * 1000); // expiresIn is expected to be in seconds, so we multiply by 1000
        }

        if (body.hasOwnProperty("refreshExpiresIn")) {
            this.refreshExpiresIn = this.isInteger(body.refreshExpiresIn)
                ? body.refreshExpiresIn
                : parseInt(body.refreshExpiresIn, 10);
            this.refreshExpiresAt = new Date(Date.now() + this.refreshExpiresIn! * 1000); // Same logic for refresh token expiration
        }
    }

    isInteger(value: any): boolean {
        return /^\d+$/.test(value);
    }
}
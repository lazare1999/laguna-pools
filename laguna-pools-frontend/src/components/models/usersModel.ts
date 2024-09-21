// types.ts
export interface User {
    userId: number;
    username: string;
    password: string;
    lastAuthDate: string;
    isLocked: boolean;
    roles: Array<string>;
}

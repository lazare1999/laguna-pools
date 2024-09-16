import {LOCAL_STORAGE_NAME} from "./constants";

const isSignedIn = (): boolean => {
    return localStorage.getItem(LOCAL_STORAGE_NAME) == "test_token";
}

export default isSignedIn;
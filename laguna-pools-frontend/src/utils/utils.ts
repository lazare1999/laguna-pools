import authClient from "../api/api";
import {HttpMethod} from "./enums/httpMethodEnum";

export const fetchRolesList = async () => {
    try {
        const rolesData = await authClient.request('admin/roles/list_roles', HttpMethod.GET);
        if (Array.isArray(rolesData.data)) {
            return rolesData.data;
        } else {
            return [];
        }
    } catch (err) {
        console.error(err)
    }
};

export const fetchBranchesList = async () => {
    try {
        const branchesData = await authClient.request('admin/branches/list_branches', HttpMethod.GET);
        if (Array.isArray(branchesData.data)) {
            return branchesData.data;
        } else {
            return [];
        }
    } catch (err) {
        console.error(err)
    }
};
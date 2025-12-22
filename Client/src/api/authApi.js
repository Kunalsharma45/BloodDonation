import client from "./client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const authApi = {
    login: async (email, password, role) => {
        const res = await client.post(`${BASE_URL}/api/login`, { Email: email, Password: password, Role: role });
        return res.data;
    },
    signup: async (data) => {
        const res = await client.post(`${BASE_URL}/api/signup`, data);
        return res.data;
    },
    refresh: async (refreshToken) => {
        const res = await client.post(`${BASE_URL}/api/refresh`, { refreshToken });
        return res.data;
    },
    me: async () => {
        const res = await client.get(`${BASE_URL}/api/auth/me`);
        return res.data;
    },
    changePassword: async (currentPassword, newPassword, confirmPassword) => {
        const res = await client.post(`${BASE_URL}/api/change-password`, {
            currentPassword,
            newPassword,
            confirmPassword
        });
        return res.data;
    },
    deleteAccount: async () => {
        const res = await client.delete(`${BASE_URL}/api/delete-account`);
        return res.data;
    },
    forgotPassword: async (email) => {
        const res = await client.post(`${BASE_URL}/api/forgot-password`, { email });
        return res.data;
    }
};

export default authApi;

import api from "./axios";

export const authApi = {
    register: (data) => api.post("/api/auth/register", data),
    login: (data) => api.post("/api/auth/login", data),
};

export const userApi = {
    me: () => api.get("/api/users/me"),
    updateMe: (data) => api.put("/api/users/me", data),
};

export const adminApi = {
    createAdmin: (data) => api.post("/api/admin/users", data),
};

import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    const login = (t, u) => {
        setToken(t); setUser(u);
        localStorage.setItem("token", t);
        localStorage.setItem("user", JSON.stringify(u));
    };

    const logout = () => {
        setToken(null); setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const updateUser = (u) => {
        setUser(u);
        if (u) {
            localStorage.setItem("user", JSON.stringify(u));
        } else {
            localStorage.removeItem("user");
        }
    };

    const value = useMemo(() => ({ token, user, login, logout, updateUser }), [token, user]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

import {createContext, useContext, useState} from "react";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("access_token")
    );

    const login = (accessToken, refreshToken) => {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
        value={{ isAuthenticated, login, logout}}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
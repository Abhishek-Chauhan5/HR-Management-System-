import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import api from "../services/api";

function Login() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[message, setMessage] = useState("");
    const navigate = useNavigate();

    const { login } = useAuth();
    
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("accounts/login/",{
                username,
                password,
            });

            login(response.data.access, response.data.refresh);
            navigate("/dashboard");
        }catch (error) {
    console.error("Login Error:", error);
    console.log("Response:", error.response?.data);
    console.log("Status:", error.response?.status);

    setMessage(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Login failed"
    );
}
    };
    return (
        <div>
            <h1>HR Management System</h1>

            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;
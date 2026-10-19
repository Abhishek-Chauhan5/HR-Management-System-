
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await api.post("accounts/login/", {
                username,
                password,
            });

            login(response.data.access, response.data.refresh);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login Error:", error);

            setMessage(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        }
    };

    return (
        <div className="login-page">
            <section className="login-brand-panel">
                <div className="brand-content">
                    <div className="brand-logo">HR</div>

                    <p className="brand-tag">HUMAN RESOURCE MANAGEMENT</p>

                    <h1>
                        Manage People.
                        <br />
                        Build Success.
                    </h1>

                    <p className="brand-description">
                        A smarter way to manage your workforce,
                        organize employee information, and
                        simplify your HR operations.
                    </p>

                    <div className="brand-features">
                        <div className="brand-feature">
                            <span className="feature-check">✓</span>
                            Employee Management
                        </div>

                        <div className="brand-feature">
                            <span className="feature-check">✓</span>
                            Centralized HR Dashboard
                        </div>

                        <div className="brand-feature">
                            <span className="feature-check">✓</span>
                            Simple and Secure Access
                        </div>
                    </div>
                </div>

                <p className="brand-footer">
                    HR Management System
                </p>
            </section>

            <section className="login-form-panel">
                <div className="login-card">
                    <div className="login-card-heading">
                        <span className="welcome-label">
                            WELCOME BACK
                        </span>

                        <h2>Sign in to your account</h2>

                        <p>
                            Enter your credentials to access your workspace.
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <label htmlFor="username">Username</label>

                        <div className="login-input-wrapper">
                            <span className="input-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                                </svg>
                            </span>

                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <label htmlFor="password">Password</label>

                        <div className="login-input-wrapper">
                            <span className="input-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <rect x="4" y="10" width="16" height="11" rx="2" />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </svg>
                            </span>

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {message && (
                            <p className="login-error" role="alert">
                                {message}
                            </p>
                        )}

                        <button type="submit" className="login-submit">
                            Sign In
                            <span aria-hidden="true">→</span>
                        </button>
                    </form>

                    <p className="login-security-note">
                        <span aria-hidden="true"></span>
                        Secure access to your workspace
                    </p>
                </div>

                <p className="login-copyright">
                    © {new Date().getFullYear()} HR Management System
                </p>
            </section>
        </div>
    );
}

export default Login;

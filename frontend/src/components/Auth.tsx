import { useCommonStore } from "../store/UserStore"
import { useState } from "react"
import "../styles/Auth.css"
import { useNavigate } from "react-router-dom"

type AuthMode = "login" | "register"
type UserRole = "user" | "recruiter"

const Auth = () => {
    const [mode, setMode] = useState<AuthMode>("login")

    const navigate = useNavigate()

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "user" as UserRole,
    })

    const { register, login } = useCommonStore()

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        if (mode === "login") {
            const success = await login({
                email: form.email,
                password: form.password,
            })
            if (success) navigate("/start-interview")
            return
        }

        const success = await register(form)
        if (success) navigate("/login")
    }

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="brand">
                    <div className="brand-logo">AI</div>
                    <span>InterviewAI</span>
                </div>

                <div className="auth-content">
                    <span className="auth-badge">
                        AI Powered Interview Preparation
                    </span>

                    <h1>
                        Practice smarter.
                        <br />
                        Interview better.
                    </h1>

                    <p>
                        Prepare for real interviews with personalized
                        questions, AI feedback, detailed reports and
                        structured preparation roadmaps.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <span>✓</span>
                            Personalized interview questions
                        </div>

                        <div className="feature-item">
                            <span>✓</span>
                            Detailed performance reports
                        </div>

                        <div className="feature-item">
                            <span>✓</span>
                            Personalized preparation roadmap
                        </div>

                        <div className="feature-item">
                            <span>✓</span>
                            Technical & system design practice
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-heading">
                        <h2>
                            {mode === "login"
                                ? "Welcome back"
                                : "Create your account"}
                        </h2>

                        <p>
                            {mode === "login"
                                ? "Sign in to continue your interview preparation."
                                : "Start preparing for your next interview."}
                        </p>
                    </div>

                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={
                                mode === "login"
                                    ? "auth-tab active"
                                    : "auth-tab"
                            }
                            onClick={() => setMode("login")}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className={
                                mode === "register"
                                    ? "auth-tab active"
                                    : "auth-tab"
                            }
                            onClick={() => setMode("register")}
                        >
                            Register
                        </button>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                        {mode === "register" && (
                            <div className="form-group">
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Enter your full name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {mode === "register" && (
                            <div className="form-group">
                                <label>Register As</label>

                                <div className="role-selector">
                                    <button
                                        type="button"
                                        className={
                                            form.role === "user"
                                                ? "role-card selected"
                                                : "role-card"
                                        }
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                role: "user",
                                            }))
                                        }
                                    >
                                        <span className="role-icon">
                                            👨‍💻
                                        </span>

                                        <div>
                                            <strong>Candidate</strong>
                                            <p>
                                                Practice and improve your
                                                interview skills.
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            form.role === "recruiter"
                                                ? "role-card selected"
                                                : "role-card"
                                        }
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                role: "recruiter",
                                            }))
                                        }
                                    >
                                        <span className="role-icon">
                                            💼
                                        </span>

                                        <div>
                                            <strong>Recruiter</strong>
                                            <p>
                                                Manage interviews and
                                                candidates.
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {mode === "login" && (
                            <div className="login-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    Remember me
                                </label>

                                <button
                                    type="button"
                                    className="forgot-password"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-submit"
                        >
                            {mode === "login"
                                ? "Sign In"
                                : "Create Account"}

                            <span>→</span>
                        </button>
                    </form>

                    <p className="switch-text">
                        {mode === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"}

                        <button
                            type="button"
                            onClick={() =>
                                setMode(
                                    mode === "login"
                                        ? "register"
                                        : "login"
                                )
                            }
                        >
                            {mode === "login"
                                ? "Create account"
                                : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Auth
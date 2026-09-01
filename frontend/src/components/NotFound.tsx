import { useNavigate } from "react-router-dom"
import "../styles/NotFound.css"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="not-found-page">
            <div className="not-found-card">
                <div className="not-found-code">
                    404
                </div>

                <div className="not-found-icon">
                    ?
                </div>

                <h1>Page Not Found</h1>

                <p>
                    The page you're looking for doesn't
                    exist or may have been moved.
                </p>

                <button
                    className="not-found-button"
                    onClick={() =>
                        navigate("/auth")
                    }
                >
                    <span>←</span>
                    Back to Login
                </button>
            </div>
        </div>
    )
}

export default NotFound
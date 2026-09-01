import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate()

    return (
        <div>
            <h1>403</h1>

            <h2>
                Access Denied
            </h2>

            <p>
                You don't have permission
                to access this page.
            </p>

            <button
                onClick={() =>
                    navigate("/")
                }
            >
                Go Home
            </button>
        </div>
    )
}

export default Unauthorized
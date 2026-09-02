import { useState } from "react"
import "../styles/StartInterview.css"
import { useCommonStore } from "../store/CommonStore"
import type { StartInterviewProps } from "../types/TStartInterview"

const ALLOWED_FILE = ["application/pdf"]
const MAX_FILE_SIZE = 5 * 1024 * 1024


const StartInterview = ({
    onclick,
}: StartInterviewProps) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [resume, setResume] = useState<File | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const { generateQuestion, startInterview } = useCommonStore()

    const handleFile = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file = e.target.files?.[0]

            if (!file) {
                setError("File Not Found")
                return
            }

            if (!ALLOWED_FILE.includes(file.type)) {
                setError("Only PDF Allowed")
                return
            }

            if (file.size > MAX_FILE_SIZE) {
                setError("File size must be under 5MB")
                return
            }

            setError("")
            setResume(file)
        } catch (error: unknown) {
            console.error("Error: ", error)
        }
    }

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault()

        if (!title || !description || !resume) {
            setError("All Fields Are Required!")
            return
        }

        setLoading(true)
        setError("")

        try {
            const formdata = new FormData()

            formdata.append("job_title", title)
            formdata.append("job_description", description)
            formdata.append("resume", resume)

            const resp = await generateQuestion(formdata)

            const data = await startInterview(resp)

            onclick(data, resp)

        } catch (error: unknown) {
            console.error("handle submit error", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="start-interview-page">
            <div className="start-interview-card">
                <div className="start-interview-header">
                    <div className="start-interview-icon">
                        AI
                    </div>

                    <div>
                        <span className="start-interview-badge">
                            Mock Interview
                        </span>

                        <h1>
                            Start Your AI Interview
                        </h1>

                        <p>
                            Add the role details and your resume.
                            We’ll generate a personalized interview
                            based on your experience and the job
                            description.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="form-error">
                        <span>!</span>
                        <p>{error}</p>
                    </div>
                )}

                <form
                    className="start-interview-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-field">
                        <label htmlFor="job-title">
                            Job Title
                        </label>

                        <input
                            id="job-title"
                            type="text"
                            placeholder="e.g. Senior Frontend Engineer"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                        />

                        <small>
                            Enter the position you're
                            preparing for.
                        </small>
                    </div>

                    <div className="form-field">
                        <label htmlFor="job-description">
                            Job Description
                        </label>

                        <textarea
                            id="job-description"
                            placeholder="Paste the job description here..."
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <small>
                            This helps generate questions
                            relevant to the role.
                        </small>
                    </div>

                    <div className="form-field">
                        <label htmlFor="resume">
                            Resume
                        </label>

                        <label
                            htmlFor="resume"
                            className="resume-upload"
                        >
                            <div className="upload-icon">
                                ↑
                            </div>

                            <div className="upload-content">
                                <strong>
                                    {resume
                                        ? resume.name
                                        : "Upload your resume"}
                                </strong>

                                <span>
                                    PDF only • Maximum 5MB
                                </span>
                            </div>

                            <span className="browse-button">
                                Browse
                            </span>
                        </label>

                        <input
                            id="resume"
                            className="file-input"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFile}
                            required
                        />

                        {resume && (
                            <div className="selected-file">
                                <span className="file-status">
                                    ✓
                                </span>

                                <div>
                                    <strong>
                                        {resume.name}
                                    </strong>

                                    <small>
                                        {(
                                            resume.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="interview-info">
                        <div>
                            <span>01</span>

                            <p>
                                AI generates personalized
                                interview questions
                            </p>
                        </div>

                        <div>
                            <span>02</span>

                            <p>
                                Answer questions in the
                                interactive interview
                            </p>
                        </div>

                        <div>
                            <span>03</span>

                            <p>
                                Receive your detailed
                                interview report
                            </p>
                        </div>
                    </div>

                    <button
                        className="start-interview-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner" />

                                Generating Questions...
                            </>
                        ) : (
                            <>
                                Start Interview
                                <span>→</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default StartInterview
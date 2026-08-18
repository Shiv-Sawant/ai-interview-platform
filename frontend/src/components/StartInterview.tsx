import { useState } from "react"
import { generateQuestionAPI, startInterviewAPI } from "../services/interview-service"

const ALLOWED_FILE = ['application/pdf']
const MAX_FILE_SIZE = 5 * 1024 * 1024

const StartInterview = ({ onclick }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [resume, setResume] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleFile = (e) => {
        try {
            const file = e.target.files[0]

            if (!file) {
                setError('File Not Found')
                return
            }
            console.log(e.target.files, file, file.type)

            if (!ALLOWED_FILE.includes(file.type)) {
                setError("Only PDF Allowed")
                return
            }

            if (file.size > MAX_FILE_SIZE) {
                setError('File size must be under 5mb')
                return
            }

            setError('')
            setResume(file)
        } catch (error) {
            console.error('Error: ', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title || !description || !resume) {
            setError("All Fields Are Required!")
            return
        }

        setLoading(true)
        setError('')

        try {
            const formdata = new FormData()
            formdata.append('job_title', title)
            formdata.append('job_description', description)
            formdata.append('resume', resume)

            const resp = await generateQuestionAPI(formdata)
            console.log(resp)

            const data = await startInterviewAPI(resp.session_id)

            onclick(data, resp.session_id)

        } catch (error) {
            console.error("handle submit error", error)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="start_interview-card">
            <h1>AI Interview Platform</h1>
            {error && <p>{error}</p>}
            <div>
                <label htmlFor="">Job Title</label>
                <input type="text" placeholder="Enter Job Title" onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="">Job Description</label>
                <input type="text" placeholder="Enter Job Description" onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="">Resume (PDF)</label>
                <input type="file" onChange={handleFile} required />
            </div>
            <button onClick={handleSubmit} disabled={loading}> {loading ? "Generating Questions" : "Start Interview"}</button>
        </div>
    )
}

export default StartInterview

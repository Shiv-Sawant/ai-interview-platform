import React from 'react'

const Report = ({ value }) => {
    const score = value?.score || "N/A"
    const correct_answer = value?.correct_answer || "N/A"
    const feedback: any = value?.improvment_area || []
    return (
        <div className='report-container'>
            <h1>Interview Report</h1>

            <div className='score-container'>
                <div className='score-card'>
                    <h2>OVERALL SCORE</h2>
                    <h1>{score}</h1>
                </div>
                <div className='score-card'>
                    <h2>CORRECT ANSWER</h2>
                    <h1>{correct_answer}</h1>
                </div>
            </div>

            <div className='detail-container'>
                <h3> Detailed Feedback</h3>
                <ul>
                    {Array.isArray(feedback) ? (
                        feedback.map((f, i) => (
                            <li key={i}>{f}</li>
                        ))
                    ) : <li>{JSON.stringify(feedback) || "sdfs"}</li>
                    }
                </ul>
            </div>
        </div>
    )
}

export default Report

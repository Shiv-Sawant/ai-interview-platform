import React from 'react'

const Interview = ({handleSkip,handleEnd}) => {
    return (
        <div>
            <button onClick={handleSkip}>Skip Question</button>
            <button onClick={handleEnd}>End Interview</button>
        </div>
    )
}

export default Interview

import React from 'react'
import speaking from '../assets/speaking.gif'
import listening from '../assets/listening.gif'
import { APP_CONSTANT } from '../utils/constant'

const Interview = ({ handleSkip, handleEnd, status }) => {
    return (
        <div className='interview-container'>
            <div className='bot-card'>

                {status == APP_CONSTANT.ASKING && <img src={speaking} alt="" />}
                {status != APP_CONSTANT.ASKING && <p>AI Interviewer</p>}

            </div>

            <div className='interview-actions'>
                <button onClick={handleSkip}>Skip Question</button>
                <button onClick={handleEnd}>End Interview</button>
            </div>

            <div className='user-card'>
                {status == APP_CONSTANT.LISTENING && <img src={listening} alt="" />}
                {status != APP_CONSTANT.LISTENING && <p>You</p>}

            </div>
        </div>
    )
}

export default Interview

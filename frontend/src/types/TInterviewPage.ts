
export type StartInterviewResponse = {
    intro_text: string
    first_question: string
}

export type SubmitAnswerResponse = {
    interviewEnded: boolean
    nextQuestion: string | null
}

export type AnswerPayload = {
    session_id: string | null
    answer: string
    skip: boolean
}

export type RoadmapItem = {
    topic: string
    priority: string
    concepts: string[]
}

export type InterviewReport = {
    overallScore?: number
    strengths?: string[]
    weaknesses?: string[]
    genericAdvice?: string[]
    roadmap?: RoadmapItem[]
}

export type ReportResponse = {
    result: InterviewReport
}
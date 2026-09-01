export type InterviewProps = {
    handleSkip: () => void | Promise<void>
    handleEnd: () => void | Promise<void>
    status: string
}
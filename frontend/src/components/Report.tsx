type RoadmapItem = {
    topic: string
    priority: string
    items: string[]
}
type ReportResult = {
    overallScore?: number
    strengths?: string[]
    weaknesses?: string[]
    genericAdvice?: string[]
    roadmap?: RoadmapItem[]
}

type ReportProps = {
    value?: {
        result?: ReportResult
    }
}

const Report = ({ value }: ReportProps) => {
    const report: any = value

    const score = report?.overallScore ?? "N/A"
    const strengths = report?.strengths ?? []
    const weaknesses = report?.weaknesses ?? []
    const genericAdvice = report?.genericAdvice ?? []
    const roadmap = report?.roadmap ?? []

    return (
        <div className="report-container">
            <h1>Interview Report</h1>

            <div className="score-container">
                <div className="score-card">
                    <h2>OVERALL SCORE</h2>
                    <h1>{score}</h1>
                </div>
            </div>

            <div className="detail-container strengths-section">
                <h3>Strengths</h3>

                <ul>
                    {strengths.length > 0 ? (
                        strengths.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No strengths available</li>
                    )}
                </ul>
            </div>

            <div className="detail-container weaknesses-section">
                <h3>Areas to Improve</h3>

                <ul>
                    {weaknesses.length > 0 ? (
                        weaknesses.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No improvement areas available</li>
                    )}
                </ul>
            </div>

            <div className="detail-container advice-section">
                <h3>General Advice</h3>

                <ul>
                    {genericAdvice.length > 0 ? (
                        genericAdvice.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No advice available</li>
                    )}
                </ul>
            </div>

            <div className="detail-container">
                <h3>Preparation Roadmap</h3>

                {roadmap.length > 0 ? (
                    roadmap.map((item, index) => (
                        <div
                            className="roadmap-card"
                            key={index}
                        >
                            <div className="roadmap-header">
                                <h4>{item?.topic}</h4>
                                <span>{item?.priority}</span>
                            </div>

                            <ul>
                                {item?.items?.map((itemValue, itemIndex) => (
                                    <li key={itemIndex}>
                                        {itemValue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No roadmap available</p>
                )}
            </div>
        </div>
    )
}

export default Report
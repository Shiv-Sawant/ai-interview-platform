import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecruiterStore } from "../store/RecruiterStore";

import "../styles/RecruiterModules.css";

const RecruiterReports = () => {
  const navigate = useNavigate();

  const { sessionId } = useParams<{
    sessionId: string;
  }>();

  const {
    getInterviewReport,
    reportRes,
    reportLoading,
  } = useRecruiterStore();

  useEffect(() => {
    if (sessionId) {
      getInterviewReport(sessionId);
    }
  }, [sessionId, getInterviewReport]);

  if (reportLoading) {
    return (
      <div className="candidate-detail-empty">
        Loading report...
      </div>
    );
  }

  if (!reportRes) {
    return (
      <div className="candidate-detail-empty">
        Interview not found
      </div>
    );
  }

  const {
    candidateName,
    email,
    jobTitle,
    status,
    createdAt,
    totalQuestions,
    answeredQuestions,
    skippedQuestions,
    report,
    questions,
  } = reportRes;

  return (
    <div className="recruiter-module">

      <button
        className="candidate-back-btn"
        onClick={() =>
          navigate("/recruiter/candidates")
        }
      >
        ← Back to Candidates
      </button>

      <div className="module-header">
        <div>
          <h1>Interview Report</h1>

          <p>
            Review candidate performance and
            interview evaluation.
          </p>
        </div>
      </div>

      {/* Candidate */}

      <div className="module-card report-candidate-header">
        <div className="report-person">

          <div className="small-avatar">
            {candidateName
              .split(" ")
              .map((item: string) => item[0])
              .join("")}
          </div>

          <div>
            <strong>{candidateName}</strong>
            <span>{email}</span>
            <span>{jobTitle}</span>
          </div>

        </div>

        <div>
          <span className={`status-pill ${status}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Stats */}

      <div className="module-stats">

        <div>
          <span>Overall Score</span>

          <strong>
            {report?.overallScore ?? 0}%
          </strong>
        </div>

        <div>
          <span>Total Questions</span>

          <strong>
            {totalQuestions}
          </strong>
        </div>

        <div>
          <span>Answered</span>

          <strong>
            {answeredQuestions}
          </strong>
        </div>

        <div>
          <span>Skipped</span>

          <strong>
            {skippedQuestions}
          </strong>
        </div>

      </div>

      {/* Strengths / Weaknesses */}

      <div className="report-detail-grid">

        <div className="module-card">
          <div className="card-title">
            <h3>Strengths</h3>
          </div>

          <div className="report-list-items">
            {report?.strengths?.map(
              (strength: string) => (
                <div key={strength}>
                  ✓ {strength}
                </div>
              )
            )}
          </div>
        </div>

        <div className="module-card">
          <div className="card-title">
            <h3>Weaknesses</h3>
          </div>

          <div className="report-list-items">
            {report?.weaknesses?.map(
              (weakness: string) => (
                <div key={weakness}>
                  • {weakness}
                </div>
              )
            )}
          </div>
        </div>

      </div>

      {/* Advice */}

      <div className="module-card report-section">

        <div className="card-title">
          <h3>AI Recommendations</h3>
        </div>

        <div className="report-list-items">
          {report?.genericAdvice?.map(
            (advice: string) => (
              <div key={advice}>
                • {advice}
              </div>
            )
          )}
        </div>

      </div>

      {/* Roadmap */}

      <div className="module-card report-section">

        <div className="card-title">
          <h3>Learning Roadmap</h3>
        </div>

        <div className="roadmap-list">
          {report?.roadmap?.map(
            (item: any) => (
              <div
                className="roadmap-item"
                key={item.topic}
              >
                <div className="roadmap-header">
                  <strong>
                    {item.topic}
                  </strong>

                  <span>
                    {item.priority}
                  </span>
                </div>

                <div className="topic-tags">
                  {item.concepts?.map(
                    (concept: string) => (
                      <span key={concept}>
                        {concept}
                      </span>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>

      </div>

      {/* Questions */}

      <div className="module-card report-section">

        <div className="card-title">
          <h3>Questions & Answers</h3>
        </div>

        <div className="question-answer-list">

          {questions?.map(
            (item: any, index: number) => (
              <div
                className="question-answer-item"
                key={item.questionId}
              >
                <div className="question-header">

                  <strong>
                    {index + 1}.{" "}
                    {item.question}
                  </strong>

                  {item.topic && (
                    <span className="question-topic">
                      {item.topic}
                    </span>
                  )}

                </div>

                {item.skipped ? (
                  <p className="skipped-answer">
                    Skipped
                  </p>
                ) : (
                  <p>
                    {item.answer ||
                      "No answer"}
                  </p>
                )}

              </div>
            )
          )}

        </div>
      </div>

      <div className="report-created-at">
        Interview Date:{" "}
        {new Date(
          createdAt
        ).toLocaleDateString("en-IN")}
      </div>

    </div>
  );
};

export default RecruiterReports;
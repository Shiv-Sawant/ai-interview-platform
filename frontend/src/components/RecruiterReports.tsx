import { useNavigate } from "react-router-dom";
import "../styles/RecruiterModules.css";

const RecruiterReports = () => {
  const navigate = useNavigate();

  const reports = [
    {
      sessionId: "abc-123",
      candidate: "Rahul Sharma",
      role: "Senior Frontend Developer",
      score: 84,
      strengths: [
        "React",
        "JavaScript",
        "API Design",
      ],
      date: "04 Sep 2026",
    },
    {
      sessionId: "ghi-789",
      candidate: "Amit Patil",
      role: "React Native Developer",
      score: 78,
      strengths: [
        "React Native",
        "Frontend",
      ],
      date: "03 Sep 2026",
    },
    {
      sessionId: "jkl-101",
      candidate: "Neha Shah",
      role: "Senior React Developer",
      score: 92,
      strengths: [
        "React",
        "System Design",
        "JavaScript",
      ],
      date: "02 Sep 2026",
    },
  ];

  return (
    <div className="recruiter-module">
      <div className="module-header">
        <div>
          <h1>Interview Reports</h1>
          <p>
            Review candidate performance and AI
            evaluation.
          </p>
        </div>
      </div>

      <div className="module-stats">
        <div>
          <span>Total Reports</span>
          <strong>51</strong>
        </div>

        <div>
          <span>Average Score</span>
          <strong>76%</strong>
        </div>

        <div>
          <span>Score 80%+</span>
          <strong>18</strong>
        </div>

        <div>
          <span>Needs Review</span>
          <strong>9</strong>
        </div>
      </div>

      <div className="module-card">
        <div className="module-toolbar">
          <input
            placeholder="Search candidate or role..."
          />

          <select>
            <option>All Scores</option>
            <option>80% and above</option>
            <option>60% - 79%</option>
            <option>Below 60%</option>
          </select>
        </div>

        <div className="report-list">
          {reports.map((report) => (
            <div
              className="report-row"
              key={report.sessionId}
            >
              <div className="report-person">
                <div className="small-avatar">
                  {report.candidate
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </div>

                <div>
                  <strong>
                    {report.candidate}
                  </strong>

                  <span>
                    {report.role}
                  </span>
                </div>
              </div>

              <div>
                <span className="report-label">
                  Strengths
                </span>

                <div className="topic-tags">
                  {report.strengths.map(
                    (strength) => (
                      <span key={strength}>
                        {strength}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="report-score">
                <span>Score</span>
                <strong>
                  {report.score}%
                </strong>
              </div>

              <div>
                <span className="report-date">
                  {report.date}
                </span>
              </div>

              <button
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    `/recruiter/interviews/${report.sessionId}`
                  )
                }
              >
                View Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterReports;
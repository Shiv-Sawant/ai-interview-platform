// RecruiterDashboard.tsx
import { useEffect } from "react"
import "../styles/RecruiterDashboards.css"
import { useRecruiterStore } from "../store/RecruiterStore"

const RecruiterDashboard = () => {
  const { getRecruiterDashboardData, recruiterDashboardRes } = useRecruiterStore()
  const stats = [
    {
      label: "Total Candidates",
      value: 48,
      description: "+8 this month",
    },
    {
      label: "Total Interviews",
      value: 62,
      description: "11 in progress",
    },
    {
      label: "Completed",
      value: 51,
      description: "82% completion rate",
    },
    {
      label: "Average Score",
      value: "76%",
      description: "+4% vs last month",
    },
  ]

  useEffect(() => {
    getRecruiterDashboardData()
  }, [])

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Track candidates, interviews and hiring performance.
          </p>
        </div>
        {/* 
        <button className="invite-button">
          + Invite Candidate
        </button> */}
      </div>

      <section className="stats-grid">
        {recruiterDashboardRes && Object.entries(recruiterDashboardRes?.stats).map(([label, value]: any, index) => (
          <div
            className="stat-card"
            key={index}
          >
            <span>{label}</span>
            <h2>{value}</h2>
            <p>{stats[index].description}</p>
          </div>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card recent-card">
          <div className="card-header">
            <div>
              <h3>Recent Interviews</h3>
              <p>Latest candidate interview activity</p>
            </div>

            {/* <button className="text-button">
              View All
            </button> */}
          </div>

          <div className="table-wrapper">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recruiterDashboardRes?.recentInterviews.map((item: any) => (
                  <tr key={item.candidateName}>
                    <td>
                      <div className="candidate-cell">
                        <div className="candidate-avatar">
                          {item.candidateName
                            .split(" ")
                            .map((x) => x[0])
                            .join("")}
                        </div>

                        <strong>{item.candidateName}</strong>
                      </div>
                    </td>

                    <td>{item.jobTitle}</td>

                    <td>
                      <span
                        className={`status-badge ${item.status.toLowerCase() === "completed"
                          ? "completed"
                          : "in-progress"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      {item.score !== null
                        ? `${item.score}%`
                        : "-"}
                    </td>

                    <td>{item.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Top Candidates</h3>
              <p>Highest interview scores</p>
            </div>
          </div>

          <div className="top-candidate-list">
            {recruiterDashboardRes?.topCandidates.map((candidate: any, index: any) => (
              <div
                className="top-candidate-item"
                key={candidate.candidateName}
              >
                <div className="candidate-rank">
                  {index + 1}
                </div>

                <div className="candidate-info">
                  <strong>{candidate.candidateName}</strong>
                  <span>{candidate.jobTitle}</span>
                </div>

                <div className="candidate-score">
                  {candidate.bestScore}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        {/* <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Hiring Pipeline</h3>
              <p>Current candidate progress</p>
            </div>
          </div>

          <div className="pipeline-list">
            <div>
              <span>Invited</span>
              <strong>14</strong>
            </div>

            <div>
              <span>In Progress</span>
              <strong>11</strong>
            </div>

            <div>
              <span>Completed</span>
              <strong>51</strong>
            </div>

            <div>
              <span>Reviewed</span>
              <strong>38</strong>
            </div>
          </div>
        </div> */}

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Common recruiter tasks</p>
            </div>
          </div>

          <div className="quick-actions">
            {/* <button>
              Invite Candidate
            </button> */}

            <button>
              View Interviews
            </button>

            {/* <button>
              Review Reports
            </button> */}

            {/* <button>
              Manage Candidates
            </button> */}
            <button>
              View Candidates
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RecruiterDashboard
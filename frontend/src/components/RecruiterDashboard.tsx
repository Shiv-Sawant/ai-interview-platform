// RecruiterDashboard.tsx
import "../styles/RecruiterDashboards.css"

const RecruiterDashboard = () => {
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

  const recentInterviews = [
    {
      name: "Rahul Sharma",
      role: "Senior Frontend Developer",
      status: "Completed",
      score: 84,
      date: "04 Sep 2026",
    },
    {
      name: "Anjali Mehta",
      role: "Backend Developer",
      status: "In Progress",
      score: null,
      date: "04 Sep 2026",
    },
    {
      name: "Amit Patil",
      role: "React Native Developer",
      status: "Completed",
      score: 78,
      date: "03 Sep 2026",
    },
  ]

  const topCandidates = [
    {
      name: "Neha Shah",
      role: "Senior React Developer",
      score: 92,
    },
    {
      name: "Rahul Sharma",
      role: "Senior Frontend Developer",
      score: 89,
    },
    {
      name: "Karan Verma",
      role: "Full Stack Developer",
      score: 87,
    },
  ]

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
        {stats.map((stat) => (
          <div
            className="stat-card"
            key={stat.label}
          >
            <span>{stat.label}</span>
            <h2>{stat.value}</h2>
            <p>{stat.description}</p>
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

            <button className="text-button">
              View All
            </button>
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
                {recentInterviews.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <div className="candidate-cell">
                        <div className="candidate-avatar">
                          {item.name
                            .split(" ")
                            .map((x) => x[0])
                            .join("")}
                        </div>

                        <strong>{item.name}</strong>
                      </div>
                    </td>

                    <td>{item.role}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "Completed"
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

                    <td>{item.date}</td>
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
            {topCandidates.map((candidate, index) => (
              <div
                className="top-candidate-item"
                key={candidate.name}
              >
                <div className="candidate-rank">
                  {index + 1}
                </div>

                <div className="candidate-info">
                  <strong>{candidate.name}</strong>
                  <span>{candidate.role}</span>
                </div>

                <div className="candidate-score">
                  {candidate.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Hiring Pipeline</h3>
              <p>Current candidate progress</p>
            </div>
          </div>

          <div className="pipeline-list">
            {/* <div>
              <span>Invited</span>
              <strong>14</strong>
            </div> */}

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
        </div>

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

            <button>
              Review Reports
            </button>

            <button>
              Manage Candidates
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RecruiterDashboard
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RecruiterModules.css";

type InterviewStatus =
  | "invited"
  | "in_progress"
  | "completed";

type Interview = {
  sessionId: string;
  candidateName: string;
  email: string;
  jobTitle: string;
  status: InterviewStatus;
  score: number | null;
  date: string;
};

const RecruiterInterviews = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const interviews: Interview[] = [
    {
      sessionId: "abc-123",
      candidateName: "Rahul Sharma",
      email: "rahul@example.com",
      jobTitle: "Senior Frontend Developer",
      status: "completed",
      score: 84,
      date: "04 Sep 2026",
    },
    {
      sessionId: "def-456",
      candidateName: "Anjali Mehta",
      email: "anjali@example.com",
      jobTitle: "Backend Developer",
      status: "in_progress",
      score: null,
      date: "04 Sep 2026",
    },
    {
      sessionId: "ghi-789",
      candidateName: "Amit Patil",
      email: "amit@example.com",
      jobTitle: "React Native Developer",
      status: "completed",
      score: 78,
      date: "03 Sep 2026",
    },
    {
      sessionId: "jkl-101",
      candidateName: "Neha Shah",
      email: "neha@example.com",
      jobTitle: "Senior React Developer",
      status: "invited",
      score: null,
      date: "02 Sep 2026",
    },
  ];

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const text = search.toLowerCase();

      const matchesSearch =
        interview.candidateName
          .toLowerCase()
          .includes(text) ||
        interview.email
          .toLowerCase()
          .includes(text) ||
        interview.jobTitle
          .toLowerCase()
          .includes(text);

      const matchesStatus =
        status === "all" ||
        interview.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const formatStatus = (value: string) =>
    value
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");

  return (
    <div className="recruiter-module">
      <div className="module-header">
        <div>
          <h1>Interviews</h1>
          <p>
            Track candidate interview progress
            and performance.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            navigate("/recruiter/invites")
          }
        >
          + Create Interview
        </button>
      </div>

      <div className="module-stats">
        <div>
          <span>Total Interviews</span>
          <strong>{interviews.length}</strong>
        </div>

        <div>
          <span>In Progress</span>
          <strong>
            {
              interviews.filter(
                (x) =>
                  x.status === "in_progress"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Completed</span>
          <strong>
            {
              interviews.filter(
                (x) =>
                  x.status === "completed"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {
              interviews.filter(
                (x) => x.status === "invited"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="module-card">
        <div className="module-toolbar">
          <input
            placeholder="Search candidate or role..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>
            <option value="invited">
              Invited
            </option>
            <option value="in_progress">
              In Progress
            </option>
            <option value="completed">
              Completed
            </option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="module-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role</th>
                <th>Status</th>
                <th>Score</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInterviews.map(
                (interview) => (
                  <tr
                    key={interview.sessionId}
                  >
                    <td>
                      <div className="person-cell">
                        <div className="small-avatar">
                          {interview.candidateName
                            .split(" ")
                            .map((x) => x[0])
                            .join("")}
                        </div>

                        <div>
                          <strong>
                            {
                              interview.candidateName
                            }
                          </strong>
                          <span>
                            {interview.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {interview.jobTitle}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${interview.status}`}
                      >
                        {formatStatus(
                          interview.status
                        )}
                      </span>
                    </td>

                    <td>
                      {interview.score !== null
                        ? `${interview.score}%`
                        : "—"}
                    </td>

                    <td>{interview.date}</td>

                    <td>
                      {interview.status ===
                      "completed" ? (
                        <button
                          className="link-btn"
                          onClick={() =>
                            navigate(
                              `/recruiter/interviews/${interview.sessionId}`
                            )
                          }
                        >
                          View Report
                        </button>
                      ) : (
                        <button className="link-btn">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruiterInterviews;
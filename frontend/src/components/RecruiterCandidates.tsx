import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RecruiterCandidates.css";

type CandidateStatus =
  | "invited"
  | "in_progress"
  | "completed"
  | "reviewed";

type Candidate = {
  id: number;
  name: string;
  email: string;
  jobTitle: string;
  status: CandidateStatus;
  score: number | null;
  interviews: number;
  invitedAt: string;
  sessionId?: string;
};

const RecruiterCandidates = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      jobTitle: "Senior Frontend Developer",
      status: "completed",
      score: 84,
      interviews: 1,
      invitedAt: "04 Sep 2026",
      sessionId: "abc-123",
    },
    {
      id: 2,
      name: "Anjali Mehta",
      email: "anjali@example.com",
      jobTitle: "Backend Developer",
      status: "in_progress",
      score: null,
      interviews: 1,
      invitedAt: "04 Sep 2026",
      sessionId: "def-456",
    },
    {
      id: 3,
      name: "Amit Patil",
      email: "amit@example.com",
      jobTitle: "React Native Developer",
      status: "reviewed",
      score: 78,
      interviews: 2,
      invitedAt: "03 Sep 2026",
      sessionId: "ghi-789",
    },
    {
      id: 4,
      name: "Neha Shah",
      email: "neha@example.com",
      jobTitle: "Senior React Developer",
      status: "completed",
      score: 92,
      interviews: 1,
      invitedAt: "02 Sep 2026",
      sessionId: "jkl-101",
    },
    {
      id: 5,
      name: "Karan Verma",
      email: "karan@example.com",
      jobTitle: "Full Stack Developer",
      status: "invited",
      score: null,
      interviews: 0,
      invitedAt: "01 Sep 2026",
    },
  ];

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        candidate.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        candidate.jobTitle
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all" ||
        candidate.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatStatus = (
    value: CandidateStatus
  ) => {
    return value
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  const handleViewCandidate = (
    candidateId: number
  ) => {
    navigate(
      `/recruiter/candidates/${candidateId}`
    );
  };

  const handleViewReport = (
    sessionId?: string
  ) => {
    if (!sessionId) return;

    navigate(
      `/recruiter/interviews/${sessionId}`
    );
  };

  return (
    <div className="recruiter-candidates">
      <div className="candidate-page-header">
        <div>
          <h1>Candidates</h1>
          <p>
            Manage candidates and track their
            interview progress.
          </p>
        </div>

        {/* <button className="candidate-invite-btn">
          + Invite Candidate
        </button> */}
      </div>

      <div className="candidate-summary">
        <div>
          <span>Total Candidates</span>
          <strong>{candidates.length}</strong>
        </div>

        {/* <div>
          <span>Invited</span>
          <strong>
            {
              candidates.filter(
                (item) =>
                  item.status === "invited"
              ).length
            }
          </strong>
        </div> */}

        <div>
          <span>In Progress</span>
          <strong>
            {
              candidates.filter(
                (item) =>
                  item.status ===
                  "in_progress"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Completed</span>
          <strong>
            {
              candidates.filter(
                (item) =>
                  item.status ===
                    "completed" ||
                  item.status === "reviewed"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="candidate-list-card">
        <div className="candidate-toolbar">
          <div className="candidate-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            {/* <option value="invited">
              Invited
            </option> */}

            <option value="in_progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="reviewed">
              Reviewed
            </option>
          </select>
        </div>

        <div className="candidate-table-wrapper">
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role</th>
                <th>Status</th>
                <th>Interviews</th>
                <th>Score</th>
                {/* <th>Invited</th> */}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCandidates.map(
                (candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="candidate-profile">
                        <div className="candidate-profile-avatar">
                          {getInitials(
                            candidate.name
                          )}
                        </div>

                        <div>
                          <strong>
                            {candidate.name}
                          </strong>

                          <span>
                            {candidate.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="candidate-role">
                        {candidate.jobTitle}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`candidate-status ${candidate.status}`}
                      >
                        {formatStatus(
                          candidate.status
                        )}
                      </span>
                    </td>

                    <td>
                      {candidate.interviews}
                    </td>

                    <td>
                      {candidate.score !== null ? (
                        <span
                          className={`candidate-score ${
                            candidate.score >= 80
                              ? "high"
                              : candidate.score >= 60
                              ? "medium"
                              : "low"
                          }`}
                        >
                          {candidate.score}%
                        </span>
                      ) : (
                        <span className="no-score">
                          —
                        </span>
                      )}
                    </td>

                    {/* <td>
                      {candidate.invitedAt}
                    </td> */}

                    <td>
                      <div className="candidate-actions">
                        <button
                          className="candidate-view-btn"
                          onClick={() =>
                            handleViewCandidate(
                              candidate.id
                            )
                          }
                        >
                          View
                        </button>

                        {candidate.score !==
                          null && (
                          <button
                            className="candidate-report-btn"
                            onClick={() =>
                              handleViewReport(
                                candidate.sessionId
                              )
                            }
                          >
                            Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="candidate-empty">
            <h3>No candidates found</h3>

            <p>
              Try changing your search or
              filter.
            </p>
          </div>
        )}

        <div className="candidate-pagination">
          <span>
            Showing 1-
            {filteredCandidates.length} of{" "}
            {filteredCandidates.length}
          </span>

          <div>
            <button disabled>Previous</button>
            <button className="active">
              1
            </button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCandidates;
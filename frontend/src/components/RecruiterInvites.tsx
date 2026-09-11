import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../utils/constant";
import "../styles/RecruiterInvites.css";
import { useRecruiterStore } from "../store/RecruiterStore";


type InviteResponse = {
  inviteId: number;
  candidateEmail: string;
  jobTitle: string;
  token: string;
  status: string;
  expiresAt: string;
};


type RecruiterInvite = {
  inviteId: number;
  candidateId: number | null;
  candidateEmail: string;
  jobTitle: string;
  status: string;
  token: string;
  sessionId: string | null;
  expiresAt: string;
  createdAt: string;
};


const RecruiterInvites = () => {
  const navigate = useNavigate();

  const [candidateEmail, setCandidateEmail] =
    useState("");

  const [jobTitle, setJobTitle] =
    useState("");

  const [jobDescription, setJobDescription] =
    useState("");

  const [expiresInDays, setExpiresInDays] =
    useState(7);

  const [loading, setLoading] =
    useState(false);

  const [createdInvite, setCreatedInvite] =
    useState<InviteResponse | null>(null);


  const {
    getRecruiterInvites,
    getRecruiterInvitesRes,
  } = useRecruiterStore();


  const invites: RecruiterInvite[] =
    getRecruiterInvitesRes?.invites ?? [];


  useEffect(() => {
    getRecruiterInvites();
  }, []);


  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !candidateEmail ||
      !jobTitle ||
      !jobDescription
    ) {
      toast.error(
        "Please fill all required fields"
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await axiosInstance.post(
          "/recruiter/invites",
          {
            candidateEmail,
            jobTitle,
            jobDescription,
            expiresInDays,
          }
        );

      setCreatedInvite(response.data);

      toast.success(
        "Interview invite created"
      );


      // Refresh Invite History
      await getRecruiterInvites();


      // Optional: reset form
      setCandidateEmail("");
      setJobTitle("");
      setJobDescription("");
      setExpiresInDays(7);

    } catch (error: any) {

      toast.error(
        error.response?.data?.detail ||
          "Unable to create invite"
      );

    } finally {
      setLoading(false);
    }
  };


  const inviteLink =
    createdInvite
      ? `${window.location.origin}/invite/${createdInvite.token}`
      : "";


  const copyInvite = async () => {
    if (!inviteLink) return;

    await navigator.clipboard.writeText(
      inviteLink
    );

    toast.success(
      "Invite link copied"
    );
  };


  const copyInviteFromHistory =
    async (token: string) => {

      const link =
        `${window.location.origin}/invite/${token}`;

      await navigator.clipboard.writeText(
        link
      );

      toast.success(
        "Invite link copied"
      );
    };


  const formatDate = (
    value: string
  ) => {
    return new Date(
      value
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const handleViewReport = (
    sessionId: string
  ) => {
    navigate(
      `/recruiter/reports/${sessionId}`
    );
  };


  return (
    <div className="recruiter-invites-page">

      {/* PAGE HEADER */}

      <div className="invite-page-header">

        <div>
          <h1>
            Interview Invites
          </h1>

          <p>
            Create interview invitations for
            candidates.
          </p>
        </div>

      </div>


      {/* CREATE INVITE */}

      <div className="recruiter-invite-layout">

        <div className="invite-form-card">

          <div className="invite-card-header">

            <h2>
              Create New Invite
            </h2>

            <p>
              Enter candidate and job details.
            </p>

          </div>


          <form
            className="create-invite-form"
            onSubmit={handleSubmit}
          >

            <label>
              Candidate Email

              <input
                type="email"
                placeholder="candidate@example.com"
                value={candidateEmail}
                onChange={(event) =>
                  setCandidateEmail(
                    event.target.value
                  )
                }
              />
            </label>


            <label>
              Job Title

              <input
                placeholder="Senior React Developer"
                value={jobTitle}
                onChange={(event) =>
                  setJobTitle(
                    event.target.value
                  )
                }
              />
            </label>


            <label>
              Job Description

              <textarea
                rows={8}
                placeholder="Enter job description..."
                value={jobDescription}
                onChange={(event) =>
                  setJobDescription(
                    event.target.value
                  )
                }
              />
            </label>


            <label>
              Invite Expiry

              <select
                value={expiresInDays}
                onChange={(event) =>
                  setExpiresInDays(
                    Number(
                      event.target.value
                    )
                  )
                }
              >

                <option value={3}>
                  3 Days
                </option>

                <option value={7}>
                  7 Days
                </option>

                <option value={14}>
                  14 Days
                </option>

                <option value={30}>
                  30 Days
                </option>

              </select>
            </label>


            <button
              type="submit"
              className="create-invite-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Interview Invite"}
            </button>

          </form>

        </div>


        {/* GENERATED INVITE */}

        <div className="invite-result-card">

          <div className="invite-card-header">

            <h2>
              Invite Link
            </h2>

            <p>
              Share this link with the
              candidate.
            </p>

          </div>


          {!createdInvite ? (

            <div className="no-invite-created">

              <div>
                🔗
              </div>

              <h3>
                No invite created yet
              </h3>

              <p>
                Create an invite to generate
                the candidate interview link.
              </p>

            </div>

          ) : (

            <div className="created-invite">

              <div className="invite-result-row">

                <span>
                  Candidate
                </span>

                <strong>
                  {
                    createdInvite
                      .candidateEmail
                  }
                </strong>

              </div>


              <div className="invite-result-row">

                <span>
                  Role
                </span>

                <strong>
                  {
                    createdInvite
                      .jobTitle
                  }
                </strong>

              </div>


              <div className="invite-result-row">

                <span>
                  Status
                </span>

                <strong
                  className={`invite-status ${createdInvite.status}`}
                >
                  {
                    createdInvite
                      .status
                  }
                </strong>

              </div>


              <div className="invite-link-box">

                <span>
                  Interview Link
                </span>

                <div>

                  <input
                    value={inviteLink}
                    readOnly
                  />

                  <button
                    type="button"
                    onClick={copyInvite}
                  >
                    Copy
                  </button>

                </div>

              </div>


              <div className="invite-expiry">

                Expires:{" "}

                {new Date(
                  createdInvite.expiresAt
                ).toLocaleString(
                  "en-IN"
                )}

              </div>

            </div>

          )}

        </div>

      </div>



      {/* ========================= */}
      {/* INVITE HISTORY */}
      {/* ========================= */}

      <div className="invite-history-card">

        <div className="invite-history-header">

          <div>
            <h2>
              Invite History
            </h2>

            <p>
              Track candidate interview
              invitations.
            </p>
          </div>


          <div className="invite-count">
            {getRecruiterInvitesRes?.total ?? 0}
            {" "}
            Invites
          </div>

        </div>


        {invites.length === 0 ? (

          <div className="invite-history-empty">

            <h3>
              No interview invites
            </h3>

            <p>
              Created invitations will
              appear here.
            </p>

          </div>

        ) : (

          <div className="invite-table-wrapper">

            <table className="invite-table">

              <thead>

                <tr>
                  <th>
                    Candidate
                  </th>

                  <th>
                    Job Title
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Created
                  </th>

                  <th>
                    Expires
                  </th>

                  <th>
                    Action
                  </th>
                </tr>

              </thead>


              <tbody>

                {invites.map(
                  (invite) => (

                    <tr
                      key={
                        invite.inviteId
                      }
                    >

                      <td>

                        <div className="candidate-email">
                          {
                            invite
                              .candidateEmail
                          }
                        </div>

                      </td>


                      <td>
                        {
                          invite
                            .jobTitle
                        }
                      </td>


                      <td>

                        <span
                          className={`history-status ${invite.status}`}
                        >
                          {
                            invite.status
                          }
                        </span>

                      </td>


                      <td>
                        {formatDate(
                          invite.createdAt
                        )}
                      </td>


                      <td>
                        {formatDate(
                          invite.expiresAt
                        )}
                      </td>


                      <td>

                        <div className="invite-actions-cell">

                          {/* PENDING */}

                          {invite.status ===
                            "pending" && (

                            <button
                              className="invite-action-btn"
                              onClick={() =>
                                copyInviteFromHistory(
                                  invite.token
                                )
                              }
                            >
                              Copy Link
                            </button>

                          )}


                          {/* STARTED */}

                          {invite.status ===
                            "started" && (

                            <>
                              <button
                                className="invite-action-btn"
                                onClick={() =>
                                  copyInviteFromHistory(
                                    invite.token
                                  )
                                }
                              >
                                Copy Link
                              </button>
                            </>

                          )}


                          {/* COMPLETED */}

                          {invite.status ===
                            "completed" &&
                            invite.sessionId && (

                            <button
                              className="invite-report-btn"
                              onClick={() =>
                                handleViewReport(
                                  invite.sessionId!
                                )
                              }
                            >
                              View Report
                            </button>

                          )}


                          {/* EXPIRED */}

                          {invite.status ===
                            "expired" && (

                            <span className="no-action">
                              Expired
                            </span>

                          )}


                          {/* CANCELLED */}

                          {invite.status ===
                            "cancelled" && (

                            <span className="no-action">
                              Cancelled
                            </span>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};


export default RecruiterInvites;
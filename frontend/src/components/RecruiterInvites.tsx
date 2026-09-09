import { useState } from "react";
import toast from "react-hot-toast";

import { axiosInstance } from "../utils/constant";

import "../styles/RecruiterInvites.css";

type InviteResponse = {
  inviteId: number;
  candidateEmail: string;
  jobTitle: string;
  token: string;
  status: string;
  expiresAt: string;
};

const RecruiterInvites = () => {
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
    await navigator.clipboard.writeText(
      inviteLink
    );

    toast.success(
      "Invite link copied"
    );
  };

  return (
    <div className="recruiter-invites-page">

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

      <div className="recruiter-invite-layout">

        {/* CREATE INVITE */}

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


        {/* GENERATED LINK */}

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
              <div>🔗</div>

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
                    createdInvite.candidateEmail
                  }
                </strong>
              </div>

              <div className="invite-result-row">
                <span>
                  Role
                </span>

                <strong>
                  {createdInvite.jobTitle}
                </strong>
              </div>

              <div className="invite-result-row">
                <span>
                  Status
                </span>

                <strong className="pending-status">
                  {createdInvite.status}
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
    </div>
  );
};

export default RecruiterInvites;
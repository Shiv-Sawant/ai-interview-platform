import { useState } from "react";
import "../styles/RecruiterModules.css";

const RecruiterInvites = () => {
  const [form, setForm] = useState({
    candidateName: "",
    email: "",
    jobTitle: "",
    jobDescription: "",
    expiryDays: "7",
  });

  const invites = [
    {
      id: 1,
      name: "Karan Verma",
      email: "karan@example.com",
      jobTitle: "Full Stack Developer",
      status: "Pending",
      sentAt: "04 Sep 2026",
    },
    {
      id: 2,
      name: "Priya Shah",
      email: "priya@example.com",
      jobTitle: "React Developer",
      status: "Accepted",
      sentAt: "03 Sep 2026",
    },
  ];

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log("Invite:", form);

    // API later:
    // await axiosInstance.post(
    //   "/recruiter/invites",
    //   form
    // )
  };

  return (
    <div className="recruiter-module">
      <div className="module-header">
        <div>
          <h1>Candidate Invites</h1>
          <p>
            Invite candidates to complete an AI
            interview.
          </p>
        </div>
      </div>

      <div className="invite-layout">
        <div className="module-card">
          <div className="card-title">
            <h3>Create Interview Invite</h3>
            <p>
              Candidate will receive a link to
              start their interview.
            </p>
          </div>

          <form
            className="recruiter-form"
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <label>
                Candidate Name

                <input
                  name="candidateName"
                  value={form.candidateName}
                  placeholder="Rahul Sharma"
                  onChange={handleChange}
                />
              </label>

              <label>
                Candidate Email

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="rahul@example.com"
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Job Title

              <input
                name="jobTitle"
                value={form.jobTitle}
                placeholder="Senior Frontend Developer"
                onChange={handleChange}
              />
            </label>

            <label>
              Job Description

              <textarea
                name="jobDescription"
                value={form.jobDescription}
                rows={7}
                placeholder="Paste job description..."
                onChange={handleChange}
              />
            </label>

            <label>
              Link Expiry

              <select
                name="expiryDays"
                value={form.expiryDays}
                onChange={handleChange}
              >
                <option value="3">
                  3 Days
                </option>
                <option value="7">
                  7 Days
                </option>
                <option value="14">
                  14 Days
                </option>
              </select>
            </label>

            <button
              className="primary-btn"
              type="submit"
            >
              Send Interview Invite
            </button>
          </form>
        </div>

        <div className="module-card">
          <div className="card-title">
            <h3>Recent Invites</h3>
            <p>
              Track sent interview invitations.
            </p>
          </div>

          <div className="invite-list">
            {invites.map((invite) => (
              <div
                className="invite-item"
                key={invite.id}
              >
                <div>
                  <strong>
                    {invite.name}
                  </strong>

                  <span>
                    {invite.jobTitle}
                  </span>

                  <small>
                    {invite.email}
                  </small>
                </div>

                <div className="invite-meta">
                  <span
                    className={`invite-status ${invite.status.toLowerCase()}`}
                  >
                    {invite.status}
                  </span>

                  <small>
                    {invite.sentAt}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterInvites;
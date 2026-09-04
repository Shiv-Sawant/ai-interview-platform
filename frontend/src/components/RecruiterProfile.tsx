import { useState } from "react";
import "../styles/RecruiterModules.css";

const RecruiterProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "Recruiter Name",
    email: "recruiter@example.com",
    company: "ABC Technologies",
    designation: "Senior Recruiter",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="recruiter-module">
      <div className="module-header">
        <div>
          <h1>Profile</h1>
          <p>
            Manage your recruiter profile and
            account information.
          </p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="module-card profile-summary">
          <div className="large-avatar">
            RN
          </div>

          <h2>{profile.fullName}</h2>

          <p>{profile.email}</p>

          <span className="role-badge">
            Recruiter
          </span>
        </div>

        <div className="module-card">
          <div className="card-title">
            <h3>Personal Information</h3>
            <p>
              Update your recruiter details.
            </p>
          </div>

          <div className="recruiter-form">
            <label>
              Full Name

              <input
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
              />
            </label>

            <label>
              Email

              <input
                name="email"
                value={profile.email}
                disabled
              />
            </label>

            <label>
              Company

              <input
                name="company"
                value={profile.company}
                onChange={handleChange}
              />
            </label>

            <label>
              Designation

              <input
                name="designation"
                value={profile.designation}
                onChange={handleChange}
              />
            </label>

            <button className="primary-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
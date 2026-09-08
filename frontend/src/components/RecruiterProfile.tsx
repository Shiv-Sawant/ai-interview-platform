import { useEffect, useState } from "react";
import "../styles/RecruiterModules.css";
import { useRecruiterStore } from "../store/RecruiterStore";

const RecruiterProfile = () => {
  const {
    getRecruiterProfile,
    updateRecruiterProfile,
    profileRes,
    isLoading,
  } = useRecruiterStore();

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    getRecruiterProfile();
  }, [getRecruiterProfile]);

  useEffect(() => {
    if (profileRes) {
      setFullName(profileRes.fullName);
    }
  }, [profileRes]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    await updateRecruiterProfile({
      fullName,
    });
  };

  if (isLoading && !profileRes) {
    return (
      <div className="candidate-detail-loading">
        Loading profile...
      </div>
    );
  }

  if (!profileRes) {
    return (
      <div className="candidate-detail-empty">
        Profile not found
      </div>
    );
  }

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

        {/* Profile Summary */}

        <div className="module-card profile-summary">

          <div className="large-avatar">
            {getInitials(
              profileRes.fullName
            )}
          </div>

          <h2>
            {profileRes.fullName}
          </h2>

          <p>
            {profileRes.email}
          </p>

          <span className="role-badge">
            Recruiter
          </span>

          <div className="profile-status">
            <span>
              Account Status
            </span>

            <strong
              className={
                profileRes.isActive
                  ? "active-profile"
                  : "inactive-profile"
              }
            >
              {profileRes.isActive
                ? "Active"
                : "Inactive"}
            </strong>
          </div>

        </div>

        {/* Profile Form */}

        <div className="module-card">

          <div className="card-title">
            <h3>
              Personal Information
            </h3>

            <p>
              Update your recruiter details.
            </p>
          </div>

          <form
            className="recruiter-form"
            onSubmit={handleSubmit}
          >

            <label>
              Full Name

              <input
                name="fullName"
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              Email

              <input
                value={profileRes.email}
                disabled
              />
            </label>

            <label>
              Role

              <input
                value={
                  profileRes.role
                    .charAt(0)
                    .toUpperCase() +
                  profileRes.role.slice(1)
                }
                disabled
              />
            </label>

            <label>
              Member Since

              <input
                value={new Date(
                  profileRes.createdAt
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
                disabled
              />
            </label>

            <button
              className="primary-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default RecruiterProfile;
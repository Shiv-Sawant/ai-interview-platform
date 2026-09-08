import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useCommonStore } from "../store/CommonStore";
import { axiosInstance } from "../utils/constant";

import "../styles/UserProfile.css";

const Profile = () => {
  const { user, profile,authLoading } = useCommonStore();

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
    }
  }, [user]);

  const getInitials = (name?: string) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    profile({ full_name: fullName })

  };

  if (!user) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="user-profile-page">

      <div className="profile-page-header">
        <div>
          <h1>Profile</h1>

          <p>
            Manage your account information.
          </p>
        </div>
      </div>

      <div className="user-profile-layout">

        {/* LEFT CARD */}

        <div className="profile-card profile-summary-card">

          <div className="user-profile-avatar">
            {getInitials(user.full_name)}
          </div>

          <h2>{user.full_name}</h2>

          <p>{user.email}</p>

          <span className="user-role-badge">
            Candidate
          </span>

          <div className="profile-account-status">
            <span>
              Account Status
            </span>

            <strong
              className={
                user.is_active
                  ? "profile-active"
                  : "profile-inactive"
              }
            >
              {user.is_active
                ? "Active"
                : "Inactive"}
            </strong>
          </div>

        </div>

        {/* RIGHT CARD */}

        <div className="profile-card">

          <div className="profile-card-title">
            <h3>
              Personal Information
            </h3>

            <p>
              Update your profile details.
            </p>
          </div>

          <form
            className="user-profile-form"
            onSubmit={handleSubmit}
          >

            <label>
              Full Name

              <input
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
                value={user.email}
                disabled
              />
            </label>

            <label>
              Account Type

              <input
                value="Candidate"
                disabled
              />
            </label>

            {user.created_at && (
              <label>
                Member Since

                <input
                  value={new Date(
                    user.created_at
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
            )}

            <button
              className="profile-save-btn"
              type="submit"
              disabled={authLoading}
            >
              {authLoading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
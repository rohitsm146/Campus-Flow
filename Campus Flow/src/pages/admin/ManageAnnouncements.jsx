import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin-dashboard.css";
import "../../styles/manage-announcements.css";
import "../../styles/manage-events.css";

function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const adminName = user?.name || "Admin";
  const avatarLetter = adminName
    .charAt(0)
    .toUpperCase();

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.replace("/");
  };

  // FETCH ANNOUNCEMENTS
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token =
          sessionStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/announcements",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to load announcements."
          );
          return;
        }

        setAnnouncements(data);
      } catch (error) {
        console.error(
          "Error fetching announcements:",
          error
        );

        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // CLEAR FORM
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  // ADD / UPDATE ANNOUNCEMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !title.trim() ||
      !description.trim()
    ) {
      alert(
        "Please fill in all fields."
      );
      return;
    }

    try {
      setSubmitting(true);

      const token =
        sessionStorage.getItem("token");

      // UPDATE ANNOUNCEMENT
      if (editingId) {
        const response = await fetch(
          `http://localhost:5000/api/announcements/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title,
              description,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to update announcement."
          );
          return;
        }

        setAnnouncements((previous) =>
          previous.map(
            (announcement) =>
              announcement._id ===
              editingId
                ? data.announcement ||
                  data
                : announcement
          )
        );

        alert(
          "Announcement updated successfully."
        );

        clearForm();
      }

      // CREATE ANNOUNCEMENT
      else {
        const response = await fetch(
          "http://localhost:5000/api/announcements",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title,
              description,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to create announcement."
          );
          return;
        }

        setAnnouncements((previous) => [
          ...previous,
          data.announcement || data,
        ]);

        alert(
          "Announcement created successfully."
        );

        clearForm();
      }
    } catch (error) {
      console.error(
        "Announcement save error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // EDIT ANNOUNCEMENT
  const handleEdit = (announcement) => {
    setEditingId(
      announcement._id
    );

    setTitle(
      announcement.title
    );

    setDescription(
      announcement.description
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE ANNOUNCEMENT
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this announcement?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete announcement."
        );
        return;
      }

      setAnnouncements((previous) =>
        previous.filter(
          (announcement) =>
            announcement._id !== id
        )
      );

      alert(
        "Announcement deleted successfully."
      );

      if (editingId === id) {
        clearForm();
      }
    } catch (error) {
      console.error(
        "Delete announcement error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          Campus Flow
        </div>

        <div className="admin-label">
          ADMIN PANEL
        </div>

        <nav>

          <Link to="/admin/admindashboard">
            Dashboard
          </Link>

          <Link to="/admin/events">
            Manage Events
          </Link>

          <Link to="/admin/clubs">
            Manage Clubs
          </Link>

          <Link
            to="/admin/announcements"
            className="active"
          >
            Manage Announcements
          </Link>

          <Link to="/admin/complaints">
            Manage Complaints
          </Link>

        </nav>

        <Link
          to="/"
          className="admin-logout"
          onClick={handleLogout}
        >
          Logout
        </Link>

      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">

          <div>

            <h1>
              Manage Announcements
            </h1>

            <p>
              Create and manage college announcements.
            </p>

          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              {avatarLetter}
            </div>

            <div>

              <strong>
                {adminName}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </header>

        {/* Error */}
        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* ADD / EDIT ANNOUNCEMENT */}
        <section className="announcement-form-card">

          <div className="form-title">

            <h2>
              {editingId
                ? "Edit Announcement"
                : "Add New Announcement"}
            </h2>

            <p>
              {editingId
                ? "Update the announcement details."
                : "Create a new announcement for students."}
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Announcement Title
              </label>

              <input
                type="text"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                rows="5"
                placeholder="Enter announcement description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              ></textarea>

            </div>

            <button
              type="submit"
              className="add-announcement-btn"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Announcement"
                : "Add Announcement"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={clearForm}
                disabled={submitting}
              >
                Cancel
              </button>
            )}

          </form>

        </section>

        {/* EXISTING ANNOUNCEMENTS */}
        <section className="events-management">

          <div className="management-header">

            <div>

              <h2>
                Existing Announcements
              </h2>

              <p>
                Manage announcements already created.
              </p>

            </div>

            <span>
              {loading
                ? "Loading..."
                : `${announcements.length} ${
                    announcements.length === 1
                      ? "Announcement"
                      : "Announcements"
                  }`}
            </span>

          </div>

          {/* SAME TABLE STYLE AS MANAGE EVENTS */}
          <div className="event-table">

            <div className="event-table-header">

              <span>
                Announcement
              </span>

              <span>
                Date
              </span>

              <span>
                Actions
              </span>

            </div>

            {loading ? (

              <div className="no-events-admin">
                Loading announcements...
              </div>

            ) : (

              announcements.map(
                (announcement) => (

                  <div
                    className="event-table-row announcement-row"
                    key={announcement._id}
                  >

                    {/* ANNOUNCEMENT */}
                    <div>

                      <strong>
                        {announcement.title}
                      </strong>

                      <small>
                        {announcement.description}
                      </small>

                    </div>

                    {/* DATE */}
                    <span>
                      {formatDate(
                        announcement.createdAt
                      )}
                    </span>

                    {/* ACTIONS */}
                    <div className="event-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(
                            announcement
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            announcement._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )

            )}

            {!loading &&
              announcements.length === 0 && (

                <div className="no-events-admin">
                  No announcements available.
                </div>

              )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default ManageAnnouncements;
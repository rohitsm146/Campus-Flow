import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin-dashboard.css";
import "../../styles/manage-announcements.css";

function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/announcements",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load announcements.");
        return;
      }

      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Load announcements when page opens
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Add / Edit announcement
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // EDIT
      if (editingId) {
        const response = await fetch(
          `http://localhost:5000/api/announcements/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title,
              description,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to update announcement.");
          return;
        }

        alert("Announcement updated successfully.");

        setAnnouncements((previous) =>
          previous.map((announcement) =>
            announcement._id === editingId
              ? data.announcement
              : announcement
          )
        );

        setEditingId(null);
        clearForm();

        return;
      }

      // CREATE
      const response = await fetch(
        "http://localhost:5000/api/announcements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create announcement.");
        return;
      }

      alert("Announcement published successfully.");

      setAnnouncements((previous) => [
        data.announcement,
        ...previous,
      ]);

      clearForm();
    } catch (error) {
      console.error("Announcement submit error:", error);
      alert("Unable to connect to the server.");
    }
  };

  // Edit announcement
  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setTitle(announcement.title);
    setDescription(announcement.description);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete announcement
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete announcement.");
        return;
      }

      alert("Announcement deleted successfully.");

      setAnnouncements((previous) =>
        previous.filter(
          (announcement) => announcement._id !== id
        )
      );
    } catch (error) {
      console.error("Delete announcement error:", error);
      alert("Unable to connect to the server.");
    }
  };

  // Clear form
  const clearForm = () => {
    setTitle("");
    setDescription("");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    clearForm();
  };

  // Format MongoDB date
  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">Campus Flow</div>

        <div className="admin-label">ADMIN PANEL</div>

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

        <Link to="/" className="admin-logout">
          Logout
        </Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Manage Announcements</h1>
            <p>
              Create and manage college announcements.
            </p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

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
                : "Create an announcement for students."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Announcement Title</label>

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
              <label>Description</label>

              <textarea
                rows="5"
                placeholder="Enter announcement details"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              ></textarea>
            </div>

            <button
              type="submit"
              className="add-announcement-btn"
            >
              {editingId
                ? "Update Announcement"
                : "Publish Announcement"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* EXISTING ANNOUNCEMENTS */}
        <section className="announcements-management">
          <div className="management-header">
            <div>
              <h2>Existing Announcements</h2>
              <p>
                Manage announcements already published.
              </p>
            </div>

            <span>
              {announcements.length}{" "}
              {announcements.length === 1
                ? "Announcement"
                : "Announcements"}
            </span>
          </div>

          {loading && (
            <p>Loading announcements...</p>
          )}

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="announcement-list">
              {announcements.map((announcement) => (
                <div
                  className="announcement-row"
                  key={announcement._id}
                >
                  <div className="announcement-content">
                    <h3>{announcement.title}</h3>

                    <p>{announcement.description}</p>

                    <span>
                      {formatDate(
                        announcement.createdAt
                      )}
                    </span>
                  </div>

                  <div className="announcement-actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(announcement)
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
              ))}

              {announcements.length === 0 && (
                <div className="no-announcements-admin">
                  No announcements available.
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManageAnnouncements;
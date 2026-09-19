import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin-dashboard.css";
import "../../styles/manage-complaints.css";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all complaints from backend
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load complaints."
        );
        return;
      }

      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Load complaints when page opens
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Update complaint status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update complaint status."
        );
        return;
      }

      alert("Complaint status updated successfully.");

      // Update complaint in list
      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint._id === id
            ? {
                ...complaint,
                status: data.complaint.status,
              }
            : complaint
        )
      );

      // Update selected complaint if it is open
      if (selectedComplaint?._id === id) {
        setSelectedComplaint((previous) => ({
          ...previous,
          status: data.complaint.status,
        }));
      }
    } catch (error) {
      console.error(
        "Complaint status update error:",
        error
      );

      alert("Unable to connect to the server.");
    }
  };

  // Format date
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

  const pendingCount = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const progressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const rejectedCount = complaints.filter(
    (complaint) => complaint.status === "Rejected"
  ).length;

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

          <Link to="/admin/announcements">
            Manage Announcements
          </Link>

          <Link
            to="/admin/complaints"
            className="active"
          >
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
            <h1>Manage Complaints</h1>

            <p>
              Review and manage student complaints.
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

        {/* COMPLAINT STATISTICS */}
        <section className="complaint-stats">
          <div className="complaint-stat-card">
            <span>Pending</span>
            <h2>{pendingCount}</h2>
          </div>

          <div className="complaint-stat-card">
            <span>In Progress</span>
            <h2>{progressCount}</h2>
          </div>

          <div className="complaint-stat-card">
            <span>Resolved</span>
            <h2>{resolvedCount}</h2>
          </div>

          <div className="complaint-stat-card">
            <span>Rejected</span>
            <h2>{rejectedCount}</h2>
          </div>
        </section>

        {/* COMPLAINT LIST */}
        <section className="complaints-management">
          <div className="management-header">
            <div>
              <h2>Student Complaints</h2>

              <p>
                Review complaints submitted by students.
              </p>
            </div>

            <span>
              {complaints.length}{" "}
              {complaints.length === 1
                ? "Complaint"
                : "Complaints"}
            </span>
          </div>

          {loading && (
            <p>Loading complaints...</p>
          )}

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="complaint-table">
              <div className="complaint-table-header">
                <span>Complaint</span>
                <span>Student</span>
                <span>Category</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {complaints.map((complaint) => (
                <div
                  className="complaint-table-row"
                  key={complaint._id}
                >
                  <div>
                    <strong>
                      {complaint.title}
                    </strong>

                    <small>
                      {formatDate(
                        complaint.createdAt
                      )}
                    </small>
                  </div>

                  <span>
                    {complaint.student?.name ||
                      "Unknown Student"}
                  </span>

                  <span className="category-tag">
                    {complaint.category}
                  </span>

                  <select
                    className={`status-select ${complaint.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    value={complaint.status}
                    onChange={(e) =>
                      handleStatusChange(
                        complaint._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>

                  <button
                    className="view-btn"
                    onClick={() =>
                      setSelectedComplaint(
                        complaint
                      )
                    }
                  >
                    View
                  </button>
                </div>
              ))}

              {complaints.length === 0 && (
                <div className="no-complaints-admin">
                  No complaints available.
                </div>
              )}
            </div>
          )}
        </section>

        {/* COMPLAINT DETAILS */}
        {selectedComplaint && (
          <section className="complaint-details">
            <div className="details-header">
              <div>
                <h2>Complaint Details</h2>

                <p>
                  Review the complete complaint
                  information.
                </p>
              </div>

              <button
                className="close-details-btn"
                onClick={() =>
                  setSelectedComplaint(null)
                }
              >
                Close
              </button>
            </div>

            <div className="details-content">
              <div className="detail-item">
                <span>Title</span>

                <strong>
                  {selectedComplaint.title}
                </strong>
              </div>

              <div className="detail-item">
                <span>Student</span>

                <strong>
                  {selectedComplaint.student?.name ||
                    "Unknown Student"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Category</span>

                <strong>
                  {selectedComplaint.category}
                </strong>
              </div>

              <div className="detail-item">
                <span>Date</span>

                <strong>
                  {formatDate(
                    selectedComplaint.createdAt
                  )}
                </strong>
              </div>

              <div className="detail-item full-width">
                <span>Description</span>

                <p>
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="detail-item">
                <span>Status</span>

                <select
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedComplaint._id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ManageComplaints;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin-dashboard.css";
import "../../styles/manage-complaints.css";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const adminName = user?.name || "Admin";
  const avatarLetter = adminName.charAt(0).toUpperCase();

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.replace("/");
  };

  // FETCH ALL COMPLAINTS
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/complaints",
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
        console.error(
          "Error fetching complaints:",
          error
        );

        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // UPDATE COMPLAINT STATUS
  const handleStatusChange = async (
    complaintId,
    status
  ) => {
    try {
      setUpdatingId(complaintId);
      setError("");

      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `https://campus-flow-backend-6ega.onrender.com/api/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update complaint status."
        );
        return;
      }

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint._id === complaintId
            ? {
                ...complaint,
                ...(data.complaint || data),

                // Keep the already loaded student details
                // because the status update response may
                // not contain the populated student object.
                student: complaint.student,
              }
            : complaint
        )
      );
    } catch (error) {
      console.error(
        "Complaint status update error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // STATUS COUNTS
  const pendingCount = complaints.filter(
    (complaint) =>
      complaint.status === "Pending"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) =>
      complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status === "Resolved"
  ).length;

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
              Manage Complaints
            </h1>

            <p>
              Review and manage student complaints.
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

        {/* COMPLAINT STATS */}
        <section className="admin-stats">

          {/* TOTAL COMPLAINTS */}
          <div className="stat-card">
            <h3>
              Total Complaints
            </h3>

            <p>
              {complaints.length}
            </p>
          </div>

          {/* PENDING */}
          <div className="stat-card">
            <h3>
              Pending
            </h3>

            <p>
              {pendingCount}
            </p>
          </div>

          {/* IN PROGRESS */}
          <div className="stat-card">
            <h3>
              In Progress
            </h3>

            <p>
              {inProgressCount}
            </p>
          </div>

          {/* RESOLVED */}
          <div className="stat-card">
            <h3>
              Resolved
            </h3>

            <p>
              {resolvedCount}
            </p>
          </div>

        </section>

        {/* COMPLAINTS */}
        <section className="complaints-management">

          <div className="management-header">

            <div>
              <h2>
                Student Complaints
              </h2>

              <p>
                View complaints and update their status.
              </p>
            </div>

            <span>
              {loading
                ? "Loading..."
                : `${complaints.length} ${
                    complaints.length === 1
                      ? "Complaint"
                      : "Complaints"
                  }`}
            </span>

          </div>

          <div className="complaint-table">

            <div className="complaint-table-header">

              <span>
                Student
              </span>

              <span>
                Complaint
              </span>

              <span>
                Category
              </span>

              <span>
                Date
              </span>

              <span>
                Status
              </span>

            </div>

            {loading ? (

              <div className="no-complaints-admin">
                Loading complaints...
              </div>

            ) : complaints.length === 0 ? (

              <div className="no-complaints-admin">
                No complaints available.
              </div>

            ) : (

              complaints.map(
                (complaint) => (

                  <div
                    className="complaint-table-row"
                    key={complaint._id}
                  >

                    <div>
                      <strong>
                        {complaint.student?.name ||
                          "Unknown Student"}
                      </strong>

                      <small>
                        {complaint.student?.email ||
                          "No email"}
                      </small>
                    </div>

                    <div>
                      <strong>
                        {complaint.title}
                      </strong>

                      <small>
                        {complaint.description}
                      </small>
                    </div>

                    <span>
                      {complaint.category}
                    </span>

                    <span>
                      {formatDate(
                        complaint.createdAt
                      )}
                    </span>

                    <select
                      value={complaint.status}
                      disabled={
                        updatingId ===
                        complaint._id
                      }
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

                  </div>
                )
              )

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default ManageComplaints;
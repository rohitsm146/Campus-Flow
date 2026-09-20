import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin-dashboard.css";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    sessionStorage.getItem("user")
  );

  const adminName = user?.name || "Admin";
  const avatarLetter = adminName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          eventsResponse,
          clubsResponse,
          announcementsResponse,
          complaintsResponse,
        ] = await Promise.all([
          fetch("https://campus-flow-backend-6ega.onrender.com/api/events", {
            headers,
          }),

          fetch("https://campus-flow-backend-6ega.onrender.com/api/clubs", {
            headers,
          }),

          fetch("https://campus-flow-backend-6ega.onrender.com/api/announcements", {
            headers,
          }),

          fetch("https://campus-flow-backend-6ega.onrender.com/api/complaints", {
            headers,
          }),
        ]);

        const eventsData =
          await eventsResponse.json();

        const clubsData =
          await clubsResponse.json();

        const announcementsData =
          await announcementsResponse.json();

        const complaintsData =
          await complaintsResponse.json();

        if (!eventsResponse.ok) {
          throw new Error(
            eventsData.message ||
              "Failed to fetch events."
          );
        }

        if (!clubsResponse.ok) {
          throw new Error(
            clubsData.message ||
              "Failed to fetch clubs."
          );
        }

        if (!announcementsResponse.ok) {
          throw new Error(
            announcementsData.message ||
              "Failed to fetch announcements."
          );
        }

        if (!complaintsResponse.ok) {
          throw new Error(
            complaintsData.message ||
              "Failed to fetch complaints."
          );
        }

        setEvents(eventsData);
        setClubs(clubsData);
        setAnnouncements(announcementsData);
        setComplaints(complaintsData);

      } catch (error) {
        console.error(
          "Error fetching admin dashboard data:",
          error
        );

        setError(
          error.message ||
            "Unable to connect to the server."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.replace("/");
  };

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 3);

  const getStudentName = (complaint) => {
    if (complaint.student?.name) {
      return complaint.student.name;
    }

    return "Student";
  };

  const getStatusClass = (status) => {
    if (status === "In Progress") {
      return "progress";
    }

    if (status === "Resolved") {
      return "resolved";
    }

    if (status === "Rejected") {
      return "rejected";
    }

    return "pending";
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

          <Link
            to="/admin/admindashboard"
            className="active"
          >
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

          <Link to="/admin/complaints">
            Manage Complaints
          </Link>

        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">

          <div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Welcome to the Campus Flow
              administration panel.
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

        {/* Statistics */}
        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>

              <span>
                Total Events
              </span>

              <h2>
                {loading
                  ? "..."
                  : events.length}
              </h2>

            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon">
              🏛️
            </div>

            <div>

              <span>
                Total Clubs
              </span>

              <h2>
                {loading
                  ? "..."
                  : clubs.length}
              </h2>

            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon">
              📢
            </div>

            <div>

              <span>
                Announcements
              </span>

              <h2>
                {loading
                  ? "..."
                  : announcements.length}
              </h2>

            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>

              <span>
                Complaints
              </span>

              <h2>
                {loading
                  ? "..."
                  : complaints.length}
              </h2>

            </div>

          </div>

        </section>

        {/* Recent Complaints */}
        <section className="admin-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Recent Complaints
              </h2>

              <p>
                Latest complaints submitted by
                students.
              </p>

            </div>

            <Link to="/admin/complaints">
              View All
            </Link>

          </div>

          <div className="recent-complaints">

            {loading ? (
              <p>
                Loading complaints...
              </p>
            ) : recentComplaints.length === 0 ? (
              <p>
                No complaints submitted yet.
              </p>
            ) : (
              recentComplaints.map(
                (complaint) => (

                  <div
                    className="recent-complaint"
                    key={complaint._id}
                  >

                    <div>

                      <h3>
                        {complaint.title}
                      </h3>

                      <p>
                        {getStudentName(
                          complaint
                        )}{" "}
                        ·{" "}
                        {complaint.category}
                      </p>

                    </div>

                    <span
                      className={`admin-status ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>

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

export default AdminDashboard;
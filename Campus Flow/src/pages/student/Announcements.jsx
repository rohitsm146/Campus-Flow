import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.replace("/");
  };

  // Fetch announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/announcements",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to load announcements."
          );
          return;
        }

        setAnnouncements(data);
      } catch (error) {
        console.error(
          "Error fetching announcements:",
          error
        );

        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Search announcements
  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      announcement.description
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          Campus Flow
        </div>

        <nav>

          <Link to="/student/studentdashboard">
            Dashboard
          </Link>

          <Link to="/student/events">
            Events
          </Link>

          <Link to="/student/clubs">
            Clubs
          </Link>

          <Link
            to="/student/announcements"
            className="active"
          >
            Announcements
          </Link>

          <Link to="/student/complaints">
            Complaints
          </Link>

        </nav>

        <Link
          to="/"
          className="logout"
          onClick={handleLogout}
        >
          Logout
        </Link>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Top Bar */}
        <header className="topbar">

          <div>
            <h1>Announcements</h1>

            <p>
              Stay updated with the latest campus
              announcements.
            </p>
          </div>

        </header>

        {/* Search */}
        <div className="search-bar">

          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* Loading */}
        {loading && (
          <p>Loading announcements...</p>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* Announcements */}
        {!loading && !error && (
          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Latest Announcements
              </h2>

            </div>

            {filteredAnnouncements.length === 0 ? (
              <p>
                No announcements found.
              </p>
            ) : (
              filteredAnnouncements.map(
                (announcement) => (
                  <div
                    className="announcement"
                    key={announcement._id}
                  >

                    <div>

                      <h3>
                        {announcement.title}
                      </h3>

                      <p>
                        {announcement.description}
                      </p>

                    </div>

                    <span>
                      {new Date(
                        announcement.createdAt
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>

                  </div>
                )
              )
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default Announcements;
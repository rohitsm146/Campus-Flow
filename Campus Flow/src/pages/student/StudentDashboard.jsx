import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

function StudentDashboard() {
  const user = JSON.parse(
    sessionStorage.getItem("user")
  );

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [clubMemberships, setClubMemberships] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [events, setEvents] = useState([]);

  const studentName = user?.name || "Student";
  const studentEmail = user?.email || "";

  const avatarLetter = studentName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const eventsResponse = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/event-registrations/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const eventsData = await eventsResponse.json();

        if (eventsResponse.ok) {
          setRegisteredEvents(eventsData);
        } else {
          console.error(
            "Failed to fetch registered events:",
            eventsData.message
          );
        }

        const clubsResponse = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/club-memberships/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const clubsData = await clubsResponse.json();

        if (clubsResponse.ok) {
          setClubMemberships(clubsData);
        } else {
          console.error(
            "Failed to fetch club memberships:",
            clubsData.message
          );
        }

        const announcementsResponse = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/announcements",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const announcementsData =
          await announcementsResponse.json();

        if (announcementsResponse.ok) {
          setAnnouncements(announcementsData);
        } else {
          console.error(
            "Failed to fetch announcements:",
            announcementsData.message
          );
        }

        const complaintsResponse = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const complaintsData =
          await complaintsResponse.json();

        if (complaintsResponse.ok) {
          setComplaints(complaintsData);
        } else {
          console.error(
            "Failed to fetch complaints:",
            complaintsData.message
          );
        }

        const allEventsResponse = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allEventsData =
          await allEventsResponse.json();

        if (allEventsResponse.ok) {
          setEvents(allEventsData);
        } else {
          console.error(
            "Failed to fetch events:",
            allEventsData.message
          );
        }
      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error
        );
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.replace("/");
  };

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .slice(0, 2);

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          Campus Flow
        </div>

        <nav>

          <Link
            to="/student/studentdashboard"
            className="active"
          >
            Dashboard
          </Link>

          <Link to="/student/events">
            Events
          </Link>

          <Link to="/student/clubs">
            Clubs
          </Link>

          <Link to="/student/announcements">
            Announcements
          </Link>

          <Link to="/student/complaints">
            Complaints
          </Link>

        </nav>

        <button
          className="logout"
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            font: "inherit",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Top Bar */}
        <header className="topbar">

          <div>
            <h1>Student Dashboard</h1>

            <p>
              Welcome back to Campus Flow!
            </p>
          </div>

          <div className="profile">

            <div className="profile-avatar">
              {avatarLetter}
            </div>

            <div>
              <strong>{studentName}</strong>
              <small>{studentEmail}</small>
            </div>

          </div>

        </header>

        {/* Statistics */}
        <section className="stats">

          <div className="stat-card">
            <h3>Registered Events</h3>
            <p>{registeredEvents.length}</p>
          </div>

          <div className="stat-card">
            <h3>Club Memberships</h3>
            <p>{clubMemberships.length}</p>
          </div>

          <div className="stat-card">
            <h3>Announcements</h3>
            <p>{announcements.length}</p>
          </div>

          <div className="stat-card">
            <h3>Complaints</h3>
            <p>{complaints.length}</p>
          </div>

        </section>

        {/* Upcoming Events */}
        <section className="dashboard-section">

          <div className="section-header">

            <h2>Upcoming Events</h2>

            <Link to="/student/events">
              View All
            </Link>

          </div>

          <div className="cards">

            {upcomingEvents.length === 0 ? (
              <p>No upcoming events available.</p>
            ) : (
              upcomingEvents.map((event) => (

                <div
                  className="event-card"
                  key={event._id}
                >

                  <h3>{event.title}</h3>

                  <p>
                    {event.description}
                  </p>

                  <div className="event-info">

                    <span>
                      📅{" "}
                      {new Date(event.date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>

                    <span>
                      🕐 {event.time}
                    </span>

                  </div>

                  <button>
                    View Event
                  </button>

                </div>

              ))
            )}

          </div>

        </section>

        {/* Announcements */}
        <section className="dashboard-section">

          <div className="section-header">

            <h2>Latest Announcements</h2>

            <Link to="/student/announcements">
              View All
            </Link>

          </div>

          {announcements.length === 0 ? (
            <p>No announcements available.</p>
          ) : (
            announcements
              .slice(0, 2)
              .map((announcement) => (

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

              ))
          )}

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;
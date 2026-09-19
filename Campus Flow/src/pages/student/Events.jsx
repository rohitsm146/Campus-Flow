import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all events and student's registrations
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get all events
        const eventsResponse = await fetch(
          "http://localhost:5000/api/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const eventsData = await eventsResponse.json();

        if (!eventsResponse.ok) {
          setError(
            eventsData.message || "Failed to load events."
          );
          return;
        }

        setEvents(eventsData);

        // Get student's registered events
        const registrationsResponse = await fetch(
          "http://localhost:5000/api/event-registrations/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const registrationsData =
          await registrationsResponse.json();

        if (registrationsResponse.ok) {
          setRegisteredEvents(registrationsData);
        }
      } catch (error) {
        console.error(
          "Error fetching events:",
          error
        );

        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Register for an event
  const handleRegister = async (eventId) => {
    // Prevent duplicate clicks
    if (isRegistered(eventId) || registeringId === eventId) {
      return;
    }

    try {
      setRegisteringId(eventId);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/event-registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Registration failed."
        );
        return;
      }

      alert(
        "Successfully registered for the event."
      );

      // Add registration to current state
      setRegisteredEvents((previous) => {
        const newRegistration =
          data.registration || data;

        // Avoid duplicate state entries
        const alreadyExists = previous.some(
          (registration) => {
            const registeredEventId =
              registration.event?._id ||
              registration.event;

            return registeredEventId === eventId;
          }
        );

        if (alreadyExists) {
          return previous;
        }

        return [
          ...previous,
          newRegistration,
        ];
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      alert(
        "Unable to register for the event."
      );
    } finally {
      setRegisteringId(null);
    }
  };

  // Check whether student is already registered
  const isRegistered = (eventId) => {
    return registeredEvents.some(
      (registration) => {
        const registeredEventId =
          registration.event?._id ||
          registration.event;

        return registeredEventId === eventId;
      }
    );
  };

  // Search events
  const filteredEvents = events.filter(
    (event) =>
      event.title
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

          <Link
            to="/student/events"
            className="active"
          >
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

        <Link
          to="/"
          className="logout"
        >
          Logout
        </Link>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Top Bar */}
        <header className="topbar">

          <div>
            <h1>Events</h1>

            <p>
              Explore upcoming events at Campus Flow.
            </p>
          </div>

        </header>

        {/* Search */}
        <div className="search-bar">

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* Loading */}
        {loading && (
          <p>Loading events...</p>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* Events */}
        {!loading && !error && (
          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Upcoming Events
              </h2>

            </div>

            {filteredEvents.length === 0 ? (

              <p>
                No events found.
              </p>

            ) : (

              <div className="cards">

                {filteredEvents.map(
                  (event) => {

                    const registered =
                      isRegistered(
                        event._id
                      );

                    const registering =
                      registeringId ===
                      event._id;

                    return (
                      <div
                        className="event-card"
                        key={event._id}
                      >

                        <h3>
                          {event.title}
                        </h3>

                        <p>
                          {event.description}
                        </p>

                        <div className="event-info">

                          <span>
                            📅{" "}
                            {new Date(
                              event.date
                            ).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>

                          <span>
                            🕐{" "}
                            {event.time}
                          </span>

                        </div>

                        <button
                          onClick={() =>
                            handleRegister(
                              event._id
                            )
                          }
                          disabled={
                            registered ||
                            registering
                          }
                        >
                          {registered
                            ? "Registered"
                            : registering
                            ? "Registering..."
                            : "Register"}
                        </button>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default Events;
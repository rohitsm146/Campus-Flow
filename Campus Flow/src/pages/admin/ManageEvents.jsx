import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin-dashboard.css";
import "../../styles/manage-events.css";

function ManageEvents() {
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Registered students from all events
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [registrationLoading, setRegistrationLoading] =
    useState(false);
  const [registrationError, setRegistrationError] =
    useState("");

  // Get admin user
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

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to load events."
          );
          return;
        }

        setEvents(data);
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

  // Fetch registered students for all events
  useEffect(() => {
    const fetchAllRegistrations = async () => {
      if (events.length === 0) {
        setRegisteredStudents([]);
        return;
      }

      try {
        setRegistrationLoading(true);
        setRegistrationError("");

        const token = sessionStorage.getItem("token");

        const registrationRequests =
          events.map(async (event) => {
            try {
              const response = await fetch(
                `https://campus-flow-backend-6ega.onrender.com/api/event-registrations/event/${event._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data =
                await response.json();

              if (!response.ok) {
                console.error(
                  `Failed to fetch registrations for ${event.title}:`,
                  data.message
                );

                return [];
              }

              const registrations =
                data.registrations || [];

              return registrations.map(
                (registration) => ({
                  ...registration,
                  eventTitle: event.title,
                })
              );
            } catch (error) {
              console.error(
                `Registration fetch error for ${event.title}:`,
                error
              );

              return [];
            }
          });

        const results = await Promise.all(
          registrationRequests
        );

        const allRegistrations =
          results.flat();

        setRegisteredStudents(
          allRegistrations
        );
      } catch (error) {
        console.error(
          "Error fetching all registrations:",
          error
        );

        setRegistrationError(
          "Unable to load registered students."
        );
      } finally {
        setRegistrationLoading(false);
      }
    };

    if (!loading) {
      fetchAllRegistrations();
    }
  }, [events, loading]);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setDescription("");
    setEditingId(null);
  };

  // Add or update event
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !title ||
      !date ||
      !time ||
      !description
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

      // UPDATE EVENT
      if (editingId) {
        const response = await fetch(
          `https://campus-flow-backend-6ega.onrender.com/api/events/${editingId}`,
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
              date,
              time,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to update event."
          );
          return;
        }

        setEvents((previous) =>
          previous.map((event) =>
            event._id === editingId
              ? data.event || data
              : event
          )
        );

        alert(
          "Event updated successfully."
        );

        resetForm();
      } else {
        // CREATE EVENT
        const response = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/events",
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
              date,
              time,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to create event."
          );
          return;
        }

        setEvents((previous) => [
          ...previous,
          data.event || data,
        ]);

        alert(
          "Event created successfully."
        );

        resetForm();
      }
    } catch (error) {
      console.error(
        "Event save error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Edit event
  const handleEdit = (event) => {
    setEditingId(event._id);

    setTitle(event.title);
    setDate(
      event.date.split("T")[0]
    );
    setTime(event.time);
    setDescription(
      event.description
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete event
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        sessionStorage.getItem("token");

      const response = await fetch(
        `https://campus-flow-backend-6ega.onrender.com/api/events/${id}`,
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
            "Failed to delete event."
        );
        return;
      }

      setEvents((previous) =>
        previous.filter(
          (event) => event._id !== id
        )
      );

      alert(
        "Event deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(
        "Delete event error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  // Format date
  const formatDate = (date) => {
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

  // Format time
  const formatTime = (time) => {
    if (!time) {
      return "";
    }

    if (
      time
        .toLowerCase()
        .includes("am") ||
      time
        .toLowerCase()
        .includes("pm")
    ) {
      return time;
    }

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours)
    );

    date.setMinutes(
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
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

          <Link
            to="/admin/events"
            className="active"
          >
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
              Manage Events
            </h1>

            <p>
              Create and manage college events.
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

        {/* Add / Edit Event */}
        <section className="event-form-card">

          <div className="form-title">

            <h2>
              {editingId
                ? "Edit Event"
                : "Add New Event"}
            </h2>

            <p>
              {editingId
                ? "Update the event details."
                : "Create a new event for students."}
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Event Title
                </label>

                <input
                  type="text"
                  placeholder="Enter event title"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Time
                </label>

                <input
                  type="time"
                  value={time}
                  onChange={(e) =>
                    setTime(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                rows="4"
                placeholder="Enter event description"
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
              className="add-event-btn"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Event"
                : "Add Event"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>
            )}

          </form>

        </section>

        {/* Existing Events */}
        <section className="events-management">

          <div className="management-header">

            <div>

              <h2>
                Existing Events
              </h2>

              <p>
                Manage events already created.
              </p>

            </div>

            <span>
              {loading
                ? "Loading..."
                : `${events.length} ${
                    events.length === 1
                      ? "Event"
                      : "Events"
                  }`}
            </span>

          </div>

          <div className="event-table">

            <div className="event-table-header">

              <span>Event</span>
              <span>Date</span>
              <span>Time</span>
              <span>Actions</span>

            </div>

            {loading ? (
              <div className="no-events-admin">
                Loading events...
              </div>
            ) : (
              events.map((event) => (

                <div
                  className="event-table-row"
                  key={event._id}
                >

                  <div>

                    <strong>
                      {event.title}
                    </strong>

                    <small>
                      {event.description}
                    </small>

                  </div>

                  <span>
                    {formatDate(
                      event.date
                    )}
                  </span>

                  <span>
                    {formatTime(
                      event.time
                    )}
                  </span>

                  <div className="event-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(event)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          event._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))
            )}

            {!loading &&
              events.length === 0 && (
                <div className="no-events-admin">
                  No events available.
                </div>
              )}

          </div>

        </section>

        {/* Registered Students */}
        <section
          className="events-management"
          style={{
            marginTop: "25px",
          }}
        >

          <div className="management-header">

            <div>

              <h2>
                Registered Students
              </h2>

              <p>
                Students who have registered for
                college events.
              </p>

            </div>

            {!registrationLoading && (
              <span>
                {registeredStudents.length}{" "}
                {registeredStudents.length === 1
                  ? "Registration"
                  : "Registrations"}
              </span>
            )}

          </div>

          {registrationLoading ? (
            <div className="no-events-admin">
              Loading registered students...
            </div>
          ) : registrationError ? (
            <div className="no-events-admin">
              {registrationError}
            </div>
          ) : registeredStudents.length ===
            0 ? (
            <div className="no-events-admin">
              No students have registered for any
              event yet.
            </div>
          ) : (
            <div className="event-table">

              <div className="event-table-header">

                <span>Event</span>
                <span>Student Name</span>
                <span>Email ID</span>
                <span>Registered At</span>

              </div>

              {registeredStudents.map(
                (registration) => (

                  <div
                    className="event-table-row"
                    key={registration._id}
                  >

                    <div>

                      <strong>
                        {registration.eventTitle ||
                          "Unknown Event"}
                      </strong>

                    </div>

                    <span>
                      {registration.student
                        ?.name ||
                        "Unknown Student"}
                    </span>

                    <span>
                      {registration.student
                        ?.email ||
                        "No email"}
                    </span>

                    <span>
                      {registration.registeredAt
                        ? new Date(
                            registration.registeredAt
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "-"}
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default ManageEvents;
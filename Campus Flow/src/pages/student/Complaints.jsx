import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Complaints() {
  const [complaints, setComplaints] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Academic");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.replace("/");
  };

  // Fetch student's complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to load complaints."
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

  // Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !title.trim() ||
      !description.trim()
    ) {
      setError(
        "Please enter both complaint title and description."
      );
      return;
    }

    try {
      setSubmitting(true);

      const token = sessionStorage.getItem("token");

      const response = await fetch(
        "https://campus-flow-backend-6ega.onrender.com/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to submit complaint."
        );
        return;
      }

      setComplaints((previous) => [
        data.complaint || data,
        ...previous,
      ]);

      setTitle("");
      setDescription("");
      setCategory("Academic");

      alert(
        "Complaint submitted successfully."
      );
    } catch (error) {
      console.error(
        "Complaint submission error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

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

          <Link to="/student/announcements">
            Announcements
          </Link>

          <Link
            to="/student/complaints"
            className="active"
          >
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
            <h1>Complaints</h1>

            <p>
              Submit and track your campus complaints.
            </p>
          </div>

        </header>

        {/* Submit Complaint Box */}
        <section className="dashboard-section">

          <div className="section-header">
            <h2>Submit a Complaint</h2>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 10px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e5e7eb",
            }}
          >

            <form onSubmit={handleSubmit}>

              {/* Title */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Complaint Title
                </label>

                <input
                  type="text"
                  placeholder="Enter complaint title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />

              </div>

              {/* Category */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                >

                  <option value="Academic">
                    Academic
                  </option>

                  <option value="Infrastructure">
                    Infrastructure
                  </option>

                  <option value="Hostel">
                    Hostel
                  </option>

                  <option value="Library">
                    Library
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Canteen">
                    Canteen
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* Description */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Description
                </label>

                <textarea
                  placeholder="Describe your complaint"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />

              </div>

              {/* Error */}
              {error && (
                <p
                  style={{
                    color: "#dc2626",
                    marginBottom: "15px",
                  }}
                >
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "12px 22px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: submitting
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "600",
                }}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Complaint"}
              </button>

            </form>

          </div>

        </section>

        {/* Complaint History */}
        <section className="dashboard-section">

          <div className="section-header">
            <h2>Complaint History</h2>
          </div>

          {loading ? (

            <p>
              Loading complaints...
            </p>

          ) : complaints.length === 0 ? (

            <div
              style={{
                background: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow:
                  "0 2px 10px rgba(0, 0, 0, 0.08)",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <p>
                No complaints submitted yet.
              </p>
            </div>

          ) : (

            <div className="cards">

              {complaints.map(
                (complaint) => (

                  <div
                    className="event-card"
                    key={complaint._id}
                  >

                    <h3>
                      {complaint.title}
                    </h3>

                    <p>
                      {complaint.description}
                    </p>

                    <div className="event-info">

                      <span>
                        📂 Category:{" "}
                        {complaint.category}
                      </span>

                      <span>
                        📅{" "}
                        {formatDate(
                          complaint.createdAt
                        )}
                      </span>

                    </div>

                    <p>
                      <strong>
                        Status:
                      </strong>{" "}
                      {complaint.status}
                    </p>

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

export default Complaints;
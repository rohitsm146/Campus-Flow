import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin-dashboard.css";
import "../../styles/manage-clubs.css";

function ManageClubs() {
  const [clubs, setClubs] = useState([]);
  const [membershipRequests, setMembershipRequests] =
    useState([]);

  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [student, setStudent] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] =
    useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestActionId, setRequestActionId] =
    useState(null);
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

  // FETCH CLUBS
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token =
          sessionStorage.getItem("token");

        const response = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/clubs",
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
              "Failed to load clubs."
          );
          return;
        }

        setClubs(data);
      } catch (error) {
        console.error(
          "Error fetching clubs:",
          error
        );

        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // FETCH CLUB MEMBERSHIP REQUESTS
  useEffect(() => {
    const fetchMembershipRequests =
      async () => {
        try {
          const token =
            sessionStorage.getItem("token");

          const response = await fetch(
            "https://campus-flow-backend-6ega.onrender.com/api/club-memberships",
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
                "Failed to load club requests."
            );
            return;
          }

          setMembershipRequests(data);
        } catch (error) {
          console.error(
            "Error fetching membership requests:",
            error
          );

          setError(
            "Unable to connect to the server."
          );
        } finally {
          setRequestsLoading(false);
        }
      };

    fetchMembershipRequests();
  }, []);

  // CLEAR FORM
  const clearForm = () => {
    setName("");
    setFaculty("");
    setStudent("");
    setDescription("");
    setEditingId(null);
  };

  // ADD / UPDATE CLUB
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !name ||
      !faculty ||
      !student ||
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

      if (editingId) {
        // UPDATE CLUB
        const response = await fetch(
          `https://campus-flow-backend-6ega.onrender.com/api/clubs/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              clubName: name,
              description,
              facultyCoordinator: faculty,
              studentCoordinator: student,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to update club."
          );
          return;
        }

        setClubs((previous) =>
          previous.map((club) =>
            club._id === editingId
              ? data.club || data
              : club
          )
        );

        alert(
          "Club updated successfully."
        );

        clearForm();
      } else {
        // CREATE CLUB
        const response = await fetch(
          "https://campus-flow-backend-6ega.onrender.com/api/clubs",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              clubName: name,
              description,
              facultyCoordinator: faculty,
              studentCoordinator: student,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to create club."
          );
          return;
        }

        setClubs((previous) => [
          ...previous,
          data.club || data,
        ]);

        alert(
          "Club created successfully."
        );

        clearForm();
      }
    } catch (error) {
      console.error(
        "Club save error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // EDIT CLUB
  const handleEdit = (club) => {
    setEditingId(club._id);

    setName(club.clubName);
    setFaculty(
      club.facultyCoordinator
    );
    setStudent(
      club.studentCoordinator
    );
    setDescription(
      club.description
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE CLUB
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this club?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        sessionStorage.getItem("token");

      const response = await fetch(
        `https://campus-flow-backend-6ega.onrender.com/api/clubs/${id}`,
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
            "Failed to delete club."
        );
        return;
      }

      setClubs((previous) =>
        previous.filter(
          (club) => club._id !== id
        )
      );

      alert(
        "Club deleted successfully."
      );

      if (editingId === id) {
        clearForm();
      }
    } catch (error) {
      console.error(
        "Delete club error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  // APPROVE / REJECT MEMBERSHIP
  const handleMembershipAction =
    async (membershipId, action) => {
      const actionText =
        action === "approve"
          ? "approve"
          : "reject";

      const confirmAction =
        window.confirm(
          `Are you sure you want to ${actionText} this club join request?`
        );

      if (!confirmAction) {
        return;
      }

      try {
        setRequestActionId(
          membershipId
        );

        const token =
          sessionStorage.getItem("token");

        const response = await fetch(
          `https://campus-flow-backend-6ega.onrender.com/api/club-memberships/${membershipId}/${action}`,
          {
            method: "PUT",
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
              `Failed to ${actionText} request.`
          );
          return;
        }

        setMembershipRequests(
          (previous) =>
            previous.map(
              (request) =>
                request._id ===
                membershipId
                  ? data.membership ||
                    request
                  : request
            )
        );

        alert(
          action === "approve"
            ? "Club membership approved successfully."
            : "Club membership rejected successfully."
        );
      } catch (error) {
        console.error(
          "Membership action error:",
          error
        );

        alert(
          "Unable to connect to the server."
        );
      } finally {
        setRequestActionId(null);
      }
    };

  // CANCEL EDIT
  const cancelEdit = () => {
    clearForm();
  };

  const pendingRequests =
    membershipRequests.filter(
      (request) =>
        request.status === "pending"
    );

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

          <Link
            to="/admin/clubs"
            className="active"
          >
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
              Manage Clubs
            </h1>

            <p>
              Create and manage college clubs.
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

        {/* ADD / EDIT CLUB */}
        <section className="club-form-card">

          <div className="form-title">

            <h2>
              {editingId
                ? "Edit Club"
                : "Add New Club"}
            </h2>

            <p>
              {editingId
                ? "Update the club details."
                : "Create a new club for students."}
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Club Name
                </label>

                <input
                  type="text"
                  placeholder="Enter club name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Faculty Coordinator
                </label>

                <input
                  type="text"
                  placeholder="Enter faculty coordinator"
                  value={faculty}
                  onChange={(e) =>
                    setFaculty(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Student Coordinator
                </label>

                <input
                  type="text"
                  placeholder="Enter student coordinator"
                  value={student}
                  onChange={(e) =>
                    setStudent(
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
                placeholder="Enter club description"
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
              className="add-club-btn"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Club"
                : "Add Club"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={cancelEdit}
                disabled={submitting}
              >
                Cancel
              </button>
            )}

          </form>

        </section>

        {/* EXISTING CLUBS */}
        <section className="clubs-management">

          <div className="management-header">

            <div>

              <h2>
                Existing Clubs
              </h2>

              <p>
                Manage clubs already created.
              </p>

            </div>

            <span>
              {loading
                ? "Loading..."
                : `${clubs.length} ${
                    clubs.length === 1
                      ? "Club"
                      : "Clubs"
                  }`}
            </span>

          </div>

          <div className="club-table">

            <div className="club-table-header">

              <span>
                Club
              </span>

              <span>
                Faculty Coordinator
              </span>

              <span>
                Student Coordinator
              </span>

              <span>
                Actions
              </span>

            </div>

            {loading ? (

              <div className="no-clubs-admin">
                Loading clubs...
              </div>

            ) : (

              clubs.map((club) => (

                <div
                  className="club-table-row"
                  key={club._id}
                >

                  <div>

                    <strong>
                      {club.clubName}
                    </strong>

                    <small>
                      {club.description}
                    </small>

                  </div>

                  <span>
                    {club.facultyCoordinator}
                  </span>

                  <span>
                    {club.studentCoordinator}
                  </span>

                  <div className="club-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(club)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          club._id
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
              clubs.length === 0 && (
                <div className="no-clubs-admin">
                  No clubs available.
                </div>
              )}

          </div>

        </section>

        {/* CLUB JOIN REQUESTS */}
        <section
          className="clubs-management"
          style={{
            marginTop: "30px",
          }}
        >

          <div className="management-header">

            <div>

              <h2>
                Club Join Requests
              </h2>

              <p>
                Review student requests to join
                clubs.
              </p>

            </div>

            <span>
              {requestsLoading
                ? "Loading..."
                : `${pendingRequests.length} ${
                    pendingRequests.length === 1
                      ? "Pending Request"
                      : "Pending Requests"
                  }`}
            </span>

          </div>

          <div className="club-table">

            <div
              className="club-table-header"
              style={{
                gridTemplateColumns:
                  "1.5fr 1.5fr 1.5fr 1fr",
              }}
            >

              <span>
                Student
              </span>

              <span>
                Email
              </span>

              <span>
                Club
              </span>

              <span>
                Action
              </span>

            </div>

            {requestsLoading ? (

              <div className="no-clubs-admin">
                Loading requests...
              </div>

            ) : pendingRequests.length === 0 ? (

              <div className="no-clubs-admin">
                No pending club requests.
              </div>

            ) : (

              pendingRequests.map(
                (request) => (

                  <div
                    className="club-table-row"
                    key={request._id}
                    style={{
                      gridTemplateColumns:
                        "1.5fr 1.5fr 1.5fr 1fr",
                    }}
                  >

                    <div>

                      <strong>
                        {request.student
                          ?.name ||
                          "Unknown Student"}
                      </strong>

                      <small>
                        Status:{" "}
                        {request.status}
                      </small>

                    </div>

                    <span>
                      {request.student
                        ?.email ||
                        "N/A"}
                    </span>

                    <span>
                      {request.club
                        ?.clubName ||
                        "Club no longer available"}
                    </span>

                    <div
                      className="club-actions"
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >

                      <button
                        className="edit-btn"
                        disabled={
                          requestActionId ===
                          request._id
                        }
                        onClick={() =>
                          handleMembershipAction(
                            request._id,
                            "approve"
                          )
                        }
                      >
                        {requestActionId ===
                        request._id
                          ? "..."
                          : "Accept"}
                      </button>

                      <button
                        className="delete-btn"
                        disabled={
                          requestActionId ===
                          request._id
                        }
                        onClick={() =>
                          handleMembershipAction(
                            request._id,
                            "reject"
                          )
                        }
                      >
                        {requestActionId ===
                        request._id
                          ? "..."
                          : "Reject"}
                      </button>

                    </div>

                  </div>

                )
              )

            )}

          </div>

          {/* ALL PROCESSED REQUESTS */}
          {!requestsLoading &&
            membershipRequests.some(
              (request) =>
                request.status !==
                "pending"
            ) && (

              <div
                style={{
                  marginTop: "25px",
                }}
              >

                <div className="management-header">

                  <div>

                    <h2>
                      Request History
                    </h2>

                    <p>
                      Previously processed club
                      requests.
                    </p>

                  </div>

                </div>

                <div className="club-table">

                  <div
                    className="club-table-header"
                    style={{
                      gridTemplateColumns:
                        "1.5fr 1.5fr 1.5fr 1fr",
                    }}
                  >

                    <span>
                      Student
                    </span>

                    <span>
                      Email
                    </span>

                    <span>
                      Club
                    </span>

                    <span>
                      Status
                    </span>

                  </div>

                  {membershipRequests
                    .filter(
                      (request) =>
                        request.status !==
                        "pending"
                    )
                    .map(
                      (request) => (

                        <div
                          className="club-table-row"
                          key={request._id}
                          style={{
                            gridTemplateColumns:
                              "1.5fr 1.5fr 1.5fr 1fr",
                          }}
                        >

                          <div>

                            <strong>
                              {request
                                .student
                                ?.name ||
                                "Unknown Student"}
                            </strong>

                          </div>

                          <span>
                            {request
                              .student
                              ?.email ||
                              "N/A"}
                          </span>

                          <span>
                            {request.club
                              ?.clubName ||
                              "Club no longer available"}
                          </span>

                          <span
                            style={{
                              textTransform:
                                "capitalize",
                              fontWeight:
                                "600",
                            }}
                          >
                            {request.status}
                          </span>

                        </div>

                      )
                    )}

                </div>

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default ManageClubs;
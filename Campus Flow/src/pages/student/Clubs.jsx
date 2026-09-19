import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [joiningClubId, setJoiningClubId] = useState(null);
  const [error, setError] = useState("");

  // Fetch clubs and student's club memberships
  useEffect(() => {
    const fetchClubsAndMemberships = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          return;
        }

        // GET ALL CLUBS
        const clubsResponse = await fetch(
          "http://localhost:5000/api/clubs",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const clubsData = await clubsResponse.json();

        if (!clubsResponse.ok) {
          setError(
            clubsData.message || "Failed to load clubs."
          );
          return;
        }

        setClubs(clubsData);

        // GET MY CLUB MEMBERSHIPS
        const membershipsResponse = await fetch(
          "http://localhost:5000/api/club-memberships/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const membershipsData =
          await membershipsResponse.json();

        if (!membershipsResponse.ok) {
          setError(
            membershipsData.message ||
              "Failed to load your club memberships."
          );
          return;
        }

        setMemberships(membershipsData);
      } catch (error) {
        console.error(
          "Error fetching clubs and memberships:",
          error
        );

        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClubsAndMemberships();
  }, []);

  // JOIN CLUB
  const handleJoinClub = async (clubId) => {
    // Prevent duplicate clicks
    if (
      getMembershipStatus(clubId) !== null ||
      joiningClubId === clubId
    ) {
      return;
    }

    try {
      setJoiningClubId(clubId);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/club-memberships",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clubId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to submit club join request."
        );
        return;
      }

      alert(
        "Club join request submitted successfully."
      );

      // If backend returns the created membership
      if (data.membership) {
        setMemberships((previous) => {
          const alreadyExists = previous.some(
            (membership) => {
              const membershipClubId =
                membership.club?._id ||
                membership.club;

              return (
                membershipClubId === clubId
              );
            }
          );

          if (alreadyExists) {
            return previous;
          }

          return [
            ...previous,
            data.membership,
          ];
        });
      } else {
        // Otherwise refresh memberships
        const membershipsResponse =
          await fetch(
            "http://localhost:5000/api/club-memberships/my",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const membershipsData =
          await membershipsResponse.json();

        if (membershipsResponse.ok) {
          setMemberships(
            membershipsData
          );
        }
      }
    } catch (error) {
      console.error(
        "Join club error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    } finally {
      setJoiningClubId(null);
    }
  };

  // GET MEMBERSHIP STATUS
  const getMembershipStatus = (clubId) => {
    const membership = memberships.find(
      (item) => {
        const membershipClubId =
          item.club?._id ||
          item.club;

        return (
          membershipClubId === clubId
        );
      }
    );

    return membership
      ? membership.status
      : null;
  };

  // SEARCH CLUBS
  const filteredClubs = clubs.filter(
    (club) =>
      club.clubName
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

          <Link
            to="/student/clubs"
            className="active"
          >
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
            <h1>Clubs</h1>

            <p>
              Explore and join clubs at Campus Flow.
            </p>
          </div>

        </header>

        {/* Search */}
        <div className="search-bar">

          <input
            type="text"
            placeholder="Search clubs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* Loading */}
        {loading && (
          <p>
            Loading clubs...
          </p>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* Clubs */}
        {!loading && !error && (
          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Available Clubs
              </h2>

            </div>

            {filteredClubs.length === 0 ? (

              <p>
                No clubs found.
              </p>

            ) : (

              <div className="cards">

                {filteredClubs.map(
                  (club) => {

                    const status =
                      getMembershipStatus(
                        club._id
                      );

                    const isJoining =
                      joiningClubId ===
                      club._id;

                    return (
                      <div
                        className="event-card"
                        key={club._id}
                      >

                        <h3>
                          {club.clubName}
                        </h3>

                        <p>
                          {club.description}
                        </p>

                        <div className="event-info">

                          <span>
                            👨‍🏫 Faculty:{" "}
                            {club.facultyCoordinator}
                          </span>

                          <span>
                            👨‍🎓 Student Coordinator:{" "}
                            {club.studentCoordinator}
                          </span>

                        </div>

                        <button
                          onClick={() =>
                            handleJoinClub(
                              club._id
                            )
                          }
                          disabled={
                            status !== null ||
                            isJoining
                          }
                        >
                          {isJoining
                            ? "Submitting..."
                            : status ===
                              "pending"
                            ? "Request Pending"
                            : status ===
                              "approved"
                            ? "Member"
                            : status ===
                              "rejected"
                            ? "Request Rejected"
                            : "Join Club"}
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

export default Clubs;
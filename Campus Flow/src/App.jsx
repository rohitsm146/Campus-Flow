import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import Events from "./pages/student/Events";
import Clubs from "./pages/student/Clubs";
import Announcements from "./pages/student/Announcements";
import Complaints from "./pages/student/Complaints";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageClubs from "./pages/admin/ManageClubs";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ManageComplaints from "./pages/admin/ManageComplaints";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student/studentdashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/events"
          element={
            <ProtectedRoute allowedRole="student">
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/clubs"
          element={
            <ProtectedRoute allowedRole="student">
              <Clubs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/announcements"
          element={
            <ProtectedRoute allowedRole="student">
              <Announcements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/complaints"
          element={
            <ProtectedRoute allowedRole="student">
              <Complaints />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/admindashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clubs"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageClubs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageAnnouncements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageComplaints />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
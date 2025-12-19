import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyReservations from "./pages/MyReservations";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminEvents from "./pages/AdminEvents";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
    return (
        <>
            <Navbar />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/events"
                        element={
                            <ProtectedRoute>
                                <Events />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/events/:id"
                        element={
                            <ProtectedRoute>
                                <EventDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reservations"
                        element={
                            <ProtectedRoute requiredRole="USER">
                                <MyReservations />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute requiredRole="USER">
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/events"
                        element={
                            <ProtectedRoute requiredRole="ADMIN">
                                <AdminEvents />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute requiredRole="ADMIN">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users/create"
                        element={
                            <ProtectedRoute requiredRole="ADMIN">
                                <AdminCreateUser />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

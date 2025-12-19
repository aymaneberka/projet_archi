import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { user, token, logout } = useAuth();
    const role = user?.role;

    return (
        <nav className="nav">
            <div className="nav-inner">
                <div className="nav-links">
                    <Link className="nav-logo" to="/">GestionEvent</Link>
                    <Link className="nav-link" to="/">Accueil</Link>
                    {token && <Link className="nav-link" to="/events">Evenements</Link>}
                    {token && role === "USER" && (
                        <>
                            <Link className="nav-link" to="/reservations">Mes reservations</Link>
                            <Link className="nav-link" to="/profile">Mon profil</Link>
                        </>
                    )}
                    {token && role === "ADMIN" && (
                        <>
                            <Link className="nav-link" to="/admin/dashboard">Dashboard admin</Link>
                            <Link className="nav-link" to="/admin/events">Evenements admin</Link>
                            <Link className="nav-link" to="/admin/users/create">Comptes admin</Link>
                        </>
                    )}
                </div>
                <div className="nav-right">
                    {!token ? (
                        <>
                            <Link className="btn btn-outline" to="/login">Connexion</Link>
                            <Link className="btn btn-primary" to="/register">Inscription</Link>
                        </>
                    ) : (
                        <>
                            <span className="pill">{user?.email}</span>
                            <button className="btn btn-outline" onClick={logout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

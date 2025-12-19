import { useState } from "react";
import { authApi, userApi } from "../api/rest";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const { login } = useAuth();
    const nav = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const res = await authApi.login({ email, password });

            // adapte si ton backend renvoie accessToken/jwt au lieu de token
            const token = res.data.token || res.data.accessToken || res.data.jwt;

            localStorage.setItem("token", token);
            const me = await userApi.me();

            login(token, me.data);
            nav("/events");
        } catch (e) {
            const payload = e.response?.data;
            const msg =
                payload?.message ||
                payload?.error ||
                (typeof payload === "string" ? payload : null) ||
                "Connexion echouee";
            setErr(msg);
        }
    };

    return (
        <div className="card animate-in" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h2>Connexion</h2>
            <p className="subtle">Accedez a votre compte pour reserver.</p>
            <form onSubmit={onSubmit} className="form" style={{ marginTop: 12 }}>
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
                <button className="btn btn-primary" type="submit">Se connecter</button>
            </form>
            {err && <div className="notice notice--error">{err}</div>}
        </div>
    );
}

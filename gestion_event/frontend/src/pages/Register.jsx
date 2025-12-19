import { useState } from "react";
import { authApi } from "../api/rest";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const nav = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            await authApi.register({ name, email, password });
            nav("/login");
        } catch (e) {
            const payload = e.response?.data;
            const msg =
                payload?.message ||
                payload?.error ||
                (typeof payload === "string" ? payload : null) ||
                "Inscription echouee";
            setErr(msg);
        }
    };

    return (
        <div className="card animate-in" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h2>Creer un compte</h2>
            <p className="subtle">Inscrivez-vous pour reserver et payer vos billets.</p>
            <form onSubmit={onSubmit} className="form" style={{ marginTop: 12 }}>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
                <button className="btn btn-primary" type="submit">Creer</button>
            </form>
            {err && <div className="notice notice--error">{err}</div>}
        </div>
    );
}

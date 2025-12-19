import { useState } from "react";
import { adminApi } from "../api/rest";

export default function AdminCreateUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setOk("");
        try {
            const res = await adminApi.createAdmin({ name, email, password });
            setOk(`Admin cree: ${res.data.email}`);
            setName("");
            setEmail("");
            setPassword("");
        } catch (e) {
            const payload = e.response?.data;
            const msg =
                payload?.message ||
                payload?.error ||
                (typeof payload === "string" ? payload : null) ||
                "Creation echouee";
            setErr(msg);
        }
    };

    return (
        <div className="card animate-in" style={{ maxWidth: 520, margin: "0 auto" }}>
            <h2>Creer un compte admin</h2>
            <p className="subtle">Les admins gerent les evenements et les stats.</p>
            <form onSubmit={onSubmit} className="form" style={{ marginTop: 12 }}>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
                <button className="btn btn-primary" type="submit">Creer</button>
            </form>
            {ok && <div className="notice notice--success">{ok}</div>}
            {err && <div className="notice notice--error">{err}</div>}
        </div>
    );
}

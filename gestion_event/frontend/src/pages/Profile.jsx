import { useEffect, useState } from "react";
import { userApi } from "../api/rest";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [role, setRole] = useState(user?.role || "");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    useEffect(() => {
        let mounted = true;
        userApi.me()
            .then((res) => {
                if (!mounted) return;
                const data = res.data;
                setName(data.name || "");
                setEmail(data.email || "");
                setRole(data.role || "");
                updateUser(data);
            })
            .catch((e) => {
                if (!mounted) return;
                const payload = e.response?.data;
                const msg =
                    payload?.message ||
                    payload?.error ||
                    (typeof payload === "string" ? payload : null) ||
                    "Chargement du profil echoue";
                setErr(msg);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, [updateUser]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setOk("");
        try {
            const res = await userApi.updateMe({ name });
            updateUser(res.data);
            setOk("Profil mis a jour.");
        } catch (e) {
            const payload = e.response?.data;
            const msg =
                payload?.message ||
                payload?.error ||
                (typeof payload === "string" ? payload : null) ||
                "Mise a jour echouee";
            setErr(msg);
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="card animate-in" style={{ maxWidth: 620, margin: "0 auto" }}>
            <h2>Mon profil</h2>
            <p className="subtle">Consulter et mettre a jour vos informations.</p>
            <form onSubmit={onSubmit} className="form" style={{ marginTop: 12 }}>
                <label>
                    <div className="subtle">Nom</div>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    <div className="subtle">Email</div>
                    <input className="input" value={email} readOnly />
                </label>
                <label>
                    <div className="subtle">Role</div>
                    <input className="input" value={role} readOnly />
                </label>
                <button className="btn btn-primary" type="submit">Mettre a jour</button>
            </form>
            {ok && <div className="notice notice--success">{ok}</div>}
            {err && <div className="notice notice--error">{err}</div>}
        </div>
    );
}

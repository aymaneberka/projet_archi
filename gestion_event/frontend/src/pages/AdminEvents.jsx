import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
    GET_EVENTS,
    CREATE_EVENT,
    UPDATE_EVENT,
    DELETE_EVENT,
} from "../api/gpl";

const emptyForm = {
    id: null,
    title: "",
    description: "",
    dateTime: "",
    location: "",
    organizer: "",
    participants: "",
    ticketLimit: 0,
    ticketPrice: 0,
};

export default function AdminEvents() {
    const { data, loading, error, refetch } = useQuery(GET_EVENTS);
    const [createEvent] = useMutation(CREATE_EVENT, { onCompleted: () => refetch() });
    const [updateEvent] = useMutation(UPDATE_EVENT, { onCompleted: () => refetch() });
    const [deleteEvent] = useMutation(DELETE_EVENT, { onCompleted: () => refetch() });

    const [form, setForm] = useState(emptyForm);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const events = useMemo(() => data?.events ?? [], [data]);

    useEffect(() => {
        if (error) setErr(error.message);
    }, [error]);

    const onChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setMsg("");
        setErr("");
    };

    const parseParticipants = (val) =>
        val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");

        const input = {
            title: form.title,
            description: form.description,
            dateTime: form.dateTime,
            location: form.location,
            organizer: form.organizer,
            participants: parseParticipants(form.participants),
            ticketLimit: Number(form.ticketLimit),
            ticketPrice: Number(form.ticketPrice),
        };

        try {
            if (form.id) {
                await updateEvent({ variables: { id: form.id, input } });
                setMsg("Evenement mis a jour.");
            } else {
                await createEvent({ variables: { input } });
                setMsg("Evenement cree.");
            }
            resetForm();
        } catch (e) {
            const payload = e?.graphQLErrors?.[0]?.message || e.message || "Erreur";
            setErr(payload);
        }
    };

    const onEdit = (ev) => {
        setForm({
            id: ev.id,
            title: ev.title || "",
            description: ev.description || "",
            dateTime: ev.dateTime || "",
            location: ev.location || "",
            organizer: ev.organizer || "",
            participants: (ev.participants || []).join(", "),
            ticketLimit: ev.ticketLimit || 0,
            ticketPrice: ev.ticketPrice || 0,
        });
        setMsg("");
        setErr("");
    };

    const onDelete = async (id) => {
        if (!window.confirm("Supprimer cet evenement ?")) return;
        setErr("");
        setMsg("");
        try {
            await deleteEvent({ variables: { id } });
            setMsg("Evenement supprime.");
        } catch (e) {
            const payload = e?.graphQLErrors?.[0]?.message || e.message || "Erreur";
            setErr(payload);
        }
    };

    return (
        <div>
            <div className="card-header">
                <div>
                    <h1 className="page-title">Evenements admin</h1>
                    <p className="subtle">Creer, modifier et gerer les evenements.</p>
                </div>
            </div>

            <section className="card animate-in" style={{ marginBottom: 20 }}>
                <h3>{form.id ? "Modifier un evenement" : "Creer un evenement"}</h3>
                <form onSubmit={onSubmit} className="form" style={{ marginTop: 12 }}>
                    <input className="input" value={form.title} onChange={onChange("title")} placeholder="Titre" required />
                    <textarea className="textarea" value={form.description} onChange={onChange("description")} placeholder="Description" rows={3} />
                    <input
                        className="input"
                        value={form.dateTime}
                        onChange={onChange("dateTime")}
                        placeholder="Date/heure (ISO ex: 2025-12-29T18:00:00)"
                        required
                    />
                    <input className="input" value={form.location} onChange={onChange("location")} placeholder="Lieu" required />
                    <input className="input" value={form.organizer} onChange={onChange("organizer")} placeholder="Organisateur" required />
                    <input
                        className="input"
                        value={form.participants}
                        onChange={onChange("participants")}
                        placeholder="Participants (separes par des virgules)"
                    />
                    <input
                        className="input"
                        type="number"
                        value={form.ticketLimit}
                        onChange={onChange("ticketLimit")}
                        placeholder="Nombre de tickets"
                        required
                    />
                    <input
                        className="input"
                        type="number"
                        step="0.01"
                        value={form.ticketPrice}
                        onChange={onChange("ticketPrice")}
                        placeholder="Prix du ticket"
                        required
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-primary" type="submit">{form.id ? "Mettre a jour" : "Creer"}</button>
                        {form.id && (
                            <button className="btn btn-outline" onClick={resetForm} type="button">Annuler</button>
                        )}
                    </div>
                </form>
                {msg && <div className="notice notice--success">{msg}</div>}
                {err && <div className="notice notice--error">{err}</div>}
            </section>

            <section className="card animate-in">
                <h3>Tous les evenements</h3>
                {loading && <p>Chargement...</p>}
                {error && <p className="notice notice--error">Erreur: {error.message}</p>}
                {!loading && events.length === 0 && <p className="subtle">Aucun evenement.</p>}
                {!loading && events.length > 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Date</th>
                                <th>Lieu</th>
                                <th>Tickets</th>
                                <th>Prix</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((ev) => (
                                <tr key={ev.id}>
                                    <td>{ev.title}</td>
                                    <td>{ev.dateTime}</td>
                                    <td>{ev.location}</td>
                                    <td>{ev.ticketLimit}</td>
                                    <td>{ev.ticketPrice}</td>
                                    <td style={{ display: "flex", gap: 8 }}>
                                        <button className="btn btn-outline" onClick={() => onEdit(ev)}>Editer</button>
                                        <button className="btn btn-danger" onClick={() => onDelete(ev.id)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

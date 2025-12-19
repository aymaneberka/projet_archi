import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { CREATE_RESERVATION, GET_EVENT_DETAILS, MY_RESERVATIONS } from "../api/gpl";
import { useAuth } from "../auth/AuthContext";

export default function EventDetails() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const { data, loading, error, refetch } = useQuery(GET_EVENT_DETAILS, {
        variables: { id },
        skip: !id,
        fetchPolicy: "cache-and-network",
    });

    const [createReservation, { loading: reserving }] = useMutation(CREATE_RESERVATION, {
        refetchQueries: [{ query: MY_RESERVATIONS }],
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");

        const qty = Number(quantity);
        if (!Number.isInteger(qty) || qty <= 0) {
            setErr("Quantite invalide");
            return;
        }

        try {
            await createReservation({ variables: { eventId: id, quantity: qty } });
            setMsg("Reservation creee, paiement en attente.");
            setQuantity(1);
            refetch();
        } catch (e) {
            const message = e?.graphQLErrors?.[0]?.message || e.message || "Erreur";
            setErr(message);
        }
    };

    if (!id) return <p>ID evenement manquant.</p>;
    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error.message}</p>;

    const event = data?.eventById;
    const available = data?.availableTickets;

    if (!event) {
        return (
            <div>
                <p>Evenement introuvable.</p>
                <Link className="btn btn-outline" to="/events">Retour</Link>
            </div>
        );
    }

    return (
        <div>
            <Link className="btn btn-outline" to="/events">Retour aux evenements</Link>
            <div className="details-grid" style={{ marginTop: 12 }}>
                <section className="card animate-in">
                    <div className="card-header">
                        <h1 className="page-title">{event.title}</h1>
                        <span className="badge">{available ?? 0} tickets restants</span>
                    </div>
                    <p className="subtle">{event.description || "Pas de description."}</p>
                    <div className="details-list" style={{ marginTop: 12 }}>
                        <div><strong>Date:</strong> {event.dateTime}</div>
                        <div><strong>Lieu:</strong> {event.location}</div>
                        <div><strong>Organisateur:</strong> {event.organizer}</div>
                        <div><strong>Prix:</strong> {event.ticketPrice}</div>
                        <div><strong>Limite:</strong> {event.ticketLimit}</div>
                    </div>
                    {Array.isArray(event.participants) && event.participants.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                            <strong>Participants:</strong>
                            <div style={{ marginTop: 6 }}>
                                {event.participants.map((p) => (
                                    <span key={p} className="chip">{p}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <aside className="card animate-in">
                    {isAdmin ? (
                        <>
                            <h3>Vue admin</h3>
                            <Link className="btn btn-outline" to="/admin/events">Gerer les evenements</Link>
                        </>
                    ) : (
                        <>
                            <h3>Reserver</h3>
                            <p className="subtle">Max 4 tickets par reservation.</p>
                            <form onSubmit={onSubmit} className="form" style={{ marginTop: 12 }}>
                                <input
                                    className="input"
                                    type="number"
                                    min="1"
                                    max="4"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                                <button className="btn btn-primary" type="submit" disabled={reserving}>
                                    {reserving ? "Reservation..." : "Reserver"}
                                </button>
                            </form>
                            {msg && <div className="notice notice--success">{msg}</div>}
                            {err && <div className="notice notice--error">{err}</div>}
                        </>
                    )}
                </aside>
            </div>
        </div>
    );
}

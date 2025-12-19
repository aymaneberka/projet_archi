import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { MY_RESERVATIONS, PAY_RESERVATION } from "../api/gpl";

export default function MyReservations() {
    const { data, loading, error, refetch } = useQuery(MY_RESERVATIONS);
    const [payReservation] = useMutation(PAY_RESERVATION);
    const [payingId, setPayingId] = useState(null);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error.message}</p>;

    const reservations = data?.myReservations ?? [];
    const statusClass = (status) => {
        if (status === "CONFIRMED") return "status status--confirmed";
        if (status === "CANCELLED") return "status status--cancelled";
        return "status status--pending";
    };

    const onPay = async (reservationId) => {
        setMsg("");
        setErr("");
        setPayingId(reservationId);
        try {
            await payReservation({ variables: { reservationId, simulateSuccess: true } });
            setMsg("Paiement confirme.");
            await refetch();
        } catch (e) {
            const message = e?.graphQLErrors?.[0]?.message || e.message || "Erreur";
            setErr(message);
        } finally {
            setPayingId(null);
        }
    };

    return (
        <div>
            <h1 className="page-title">Mes reservations</h1>
            {msg && <div className="notice notice--success">{msg}</div>}
            {err && <div className="notice notice--error">{err}</div>}
            {reservations.length === 0 ? (
                <p className="subtle">Aucune reservation.</p>
            ) : (
                <div className="card animate-in">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Evenement</th>
                                <th>Date</th>
                                <th>Quantite</th>
                                <th>Total</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((r) => (
                                <tr key={r.id}>
                                    <td>
                                        {r.event?.id ? (
                                        <Link className="link" to={`/events/${r.event.id}`}>{r.event.title}</Link>
                                        ) : (
                                            r.event?.title || "-"
                                        )}
                                    </td>
                                    <td>{r.event?.dateTime || "-"}</td>
                                    <td>{r.quantity}</td>
                                    <td>{r.totalAmount}</td>
                                    <td><span className={statusClass(r.status)}>{r.status}</span></td>
                                    <td>
                                        {r.status === "PENDING_PAYMENT" ? (
                                            <button className="btn btn-primary" onClick={() => onPay(r.id)} disabled={payingId === r.id}>
                                                {payingId === r.id ? "Paiement..." : "Payer"}
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

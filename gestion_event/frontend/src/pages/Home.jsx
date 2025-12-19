import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "../auth/AuthContext";
import { GET_EVENTS } from "../api/gpl";
import EventCard from "../components/EventCard";

const fallbackEvents = [
    {
        id: "f1",
        title: "Match de foot",
        organizer: "Ligue nationale",
        location: "Stadium",
        dateTime: "2026-01-10T18:00:00",
        ticketPrice: 50,
        category: "Football",
    },
    {
        id: "f2",
        title: "Concert live",
        organizer: "Studio 9",
        location: "Arena",
        dateTime: "2026-02-05T20:30:00",
        ticketPrice: 80,
        category: "Concert",
    },
    {
        id: "f3",
        title: "Conference tech",
        organizer: "TechHub",
        location: "Convention Center",
        dateTime: "2026-03-12T09:00:00",
        ticketPrice: 120,
        category: "Conference",
    },
];

const inferCategory = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("match")) return "Football";
    if (t.includes("concert")) return "Concert";
    if (t.includes("conference")) return "Conference";
    return "Evenement";
};

export default function Home() {
    const { token } = useAuth();
    const { data } = useQuery(GET_EVENTS, {
        skip: !token,
        fetchPolicy: "network-only",
    });

    const events = useMemo(() => {
        if (token) return data?.events ?? [];
        return fallbackEvents;
    }, [data, token]);

    const actionLabel = "En savoir plus";
    const actionTo = "/login";

    return (
        <div className="home">
            <section className="hero animate-in">
                <div>
                    <h1 className="page-title">GestionEvent</h1>
                    <p className="subtle">
                        Plateforme moderne pour matchs, concerts et conferences.
                    </p>
                    <div className="hero-actions">
                        {token ? (
                            <Link className="btn btn-primary" to="/events">Acceder aux evenements</Link>
                        ) : (
                            <>
                                <Link className="btn btn-primary" to="/login">Se connecter</Link>
                                <Link className="btn btn-outline" to="/register">Creer un compte</Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="hero-panel">
                    <div className="badge">Tickets limites</div>
                    <div className="badge">Paiement securise</div>
                    <div className="badge">Notifications email</div>
                </div>
            </section>

            <section style={{ marginTop: 24 }}>
                <div className="card-header">
                    <div>
                        <h2>Catalogue d'evenements</h2>
                        <p className="subtle">Survolez une carte pour en savoir plus.</p>
                    </div>
                </div>
                {events.length === 0 ? (
                    <p className="subtle">Aucun evenement pour le moment.</p>
                ) : (
                    <div className="cards">
                        {events.map((e, index) => (
                            <EventCard
                                key={e.id}
                                title={e.title}
                                subtitle={`${e.organizer} - ${e.location}`}
                                date={e.dateTime}
                                price={e.ticketPrice}
                                available={e.availableTickets}
                                category={e.category || inferCategory(e.title)}
                                actionLabel={actionLabel}
                                actionTo={actionTo}
                                delay={index * 80}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

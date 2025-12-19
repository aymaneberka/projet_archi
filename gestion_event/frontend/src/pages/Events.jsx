import { useQuery } from "@apollo/client/react";
import { GET_EVENTS } from "../api/gpl";
import EventCard from "../components/EventCard";

export default function Events() {
    const { data, loading, error } = useQuery(GET_EVENTS, { fetchPolicy: "network-only" });

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error.message}</p>;

    const events = data?.events ?? [];
    const inferCategory = (title) => {
        const t = (title || "").toLowerCase();
        if (t.includes("match")) return "Football";
        if (t.includes("concert")) return "Concert";
        if (t.includes("conference")) return "Conference";
        return "Event";
    };

    return (
        <div>
            <div className="card-header animate-in">
                <div>
                    <h1 className="page-title">Evenements</h1>
                    <p className="subtle">Decouvrez les evenements a venir et reservez vos places.</p>
                </div>
            </div>
            {events.length === 0 ? (
                <p className="subtle">Aucun evenement.</p>
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
                            category={inferCategory(e.title)}
                            actionLabel="Voir details"
                            actionTo={`/events/${e.id}`}
                            delay={index * 60}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

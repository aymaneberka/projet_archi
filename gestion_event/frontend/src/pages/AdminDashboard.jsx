import { useQuery } from "@apollo/client/react";
import { ADMIN_STATS } from "../api/gpl";
import StatCard from "../components/StatCard";

export default function AdminDashboard() {
    const { data, loading, error, refetch } = useQuery(ADMIN_STATS, {
        fetchPolicy: "network-only",
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const stats = data?.adminStats;
    const revenueValue = Number(stats?.revenue ?? 0);
    const revenue = revenueValue.toFixed(2);
    const chartData = [
        { label: "Evenements", value: Number(stats?.eventsCount ?? 0), tone: "primary" },
        { label: "Tickets vendus", value: Number(stats?.ticketsSold ?? 0), tone: "mint" },
        { label: "Revenus", value: revenueValue, tone: "amber", display: revenue },
    ];
    const maxValue = Math.max(1, ...chartData.map((d) => d.value));

    return (
        <div>
            <div className="card-header">
                <div>
                    <h1 className="page-title">Dashboard admin</h1>
                    <p className="subtle">Vue en temps reel de l activite.</p>
                </div>
                <button className="btn btn-outline" onClick={() => refetch()}>Rafraichir</button>
            </div>
            <div className="stat-grid">
                <StatCard
                    label="Evenements"
                    value={stats?.eventsCount ?? 0}
                    hint="Catalogue actif"
                    tone="primary"
                />
                <StatCard
                    label="Tickets vendus"
                    value={stats?.ticketsSold ?? 0}
                    hint="Reservations confirmees"
                    tone="mint"
                />
                <StatCard
                    label="Revenus"
                    value={revenue}
                    hint="Transactions payees"
                    tone="amber"
                />
            </div>
            <section className="card chart-card" style={{ marginTop: 20 }}>
                <div className="card-header">
                    <div>
                        <h3>Activite globale</h3>
                        <p className="subtle">Comparatif visuel des indicateurs.</p>
                    </div>
                </div>
                <div className="chart">
                    {chartData.map((item) => (
                        <div key={item.label} className="chart-row">
                            <div className="chart-label">{item.label}</div>
                            <div className={`chart-bar chart-bar--${item.tone}`}>
                                <span
                                    className="chart-fill"
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                />
                            </div>
                            <div className="chart-value">{item.display ?? item.value}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function StatCard({ label, value, hint, tone = "primary" }) {
    return (
        <div className={`stat-card stat-card--${tone} animate-in`}>
            <div className="stat-card__label">{label}</div>
            <div className="stat-card__value">{value}</div>
            {hint && <div className="stat-card__hint">{hint}</div>}
        </div>
    );
}

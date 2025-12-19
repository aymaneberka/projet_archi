import { Link } from "react-router-dom";

export default function EventCard({
    title,
    subtitle,
    date,
    price,
    available,
    category,
    actionLabel,
    actionTo,
    delay = 0,
}) {
    return (
        <article className="card event-card animate-in" style={{ animationDelay: `${delay}ms` }}>
            <div className="event-card__overlay">
                <Link to={actionTo}>{actionLabel}</Link>
            </div>
            <div className="card-header">
                <div>
                    <h3>{title}</h3>
                    {category && <span className="badge">{category}</span>}
                </div>
                {available !== undefined && available !== null && (
                    <span className="badge">{available} tickets restants</span>
                )}
            </div>
            {subtitle && <div className="event-card__meta">{subtitle}</div>}
            {date && <div className="event-card__meta">{date}</div>}
            {price !== undefined && (
                <div className="event-card__meta">Prix: {price}</div>
            )}
        </article>
    );
}

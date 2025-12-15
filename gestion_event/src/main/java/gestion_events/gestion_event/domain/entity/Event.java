package gestion_events.gestion_event.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name="events")
public class Event {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String title;

    @Column(length=2000)
    private String description;

    @Column(nullable=false)
    private LocalDateTime dateTime;

    @Column(nullable=false)
    private String location;

    @Column(nullable=false)
    private String organizer;

    @ElementCollection
    @CollectionTable(name="event_participants", joinColumns=@JoinColumn(name="event_id"))
    @Column(name="participant")
    private List<String> participants;

    @Column(nullable=false)
    private Integer ticketLimit;

    @Column(nullable=false, precision = 12, scale = 2)
    private BigDecimal ticketPrice;
}


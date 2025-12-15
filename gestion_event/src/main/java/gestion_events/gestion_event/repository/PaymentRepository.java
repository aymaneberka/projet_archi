package gestion_events.gestion_event.repository;

import gestion_events.gestion_event.domain.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {}

package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "impact_logs")
public class ImpactLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User provider;

    @Column(nullable = false)
    private Integer casesTaken = 0;

    @Column(nullable = false)
    private Integer casesResolved = 0;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    public ImpactLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }

    public Integer getCasesTaken() { return casesTaken; }
    public void setCasesTaken(Integer casesTaken) { this.casesTaken = casesTaken; }

    public Integer getCasesResolved() { return casesResolved; }
    public void setCasesResolved(Integer casesResolved) { this.casesResolved = casesResolved; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}

package com.legalmatch.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "impact_logs")
public class ImpactLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User provider;

    // Legacy DB compatibility: some schemas require profile_id to be non-null.
    @Column(name = "profile_id", nullable = false)
    private Long profileId;

    @Column(nullable = false)
    private Integer casesTaken = 0;

    @Column(nullable = false)
    private Integer casesResolved = 0;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    public ImpactLog() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getProvider() {
        return provider;
    }

    public void setProvider(User provider) {
        this.provider = provider;
        if (provider != null) {
            this.profileId = provider.getId();
        }
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public Integer getCasesTaken() {
        return casesTaken;
    }

    public void setCasesTaken(Integer casesTaken) {
        this.casesTaken = casesTaken;
    }

    public Integer getCasesResolved() {
        return casesResolved;
    }

    public void setCasesResolved(Integer casesResolved) {
        this.casesResolved = casesResolved;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    @PrePersist
    @PreUpdate
    private void syncLegacyProfileId() {
        if (profileId == null && provider != null) {
            profileId = provider.getId();
        }
    }
}

package com.legalmatch.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long matchId;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private Case legalCase;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User matchedUser;

    // Milestone-3 explicit provider fields (kept alongside matchedUser for backward compatibility).
    private Long providerId;
    private String providerType; // LAWYER / NGO

    @Column(name = "status", nullable = false)
    private String status; // Legacy DB column kept for compatibility.

    private String matchStatus; // PENDING, REQUESTED, APPROVED, REJECTED
    private boolean lawyerApprovedChat;
    private boolean ngoApprovedChat;
    private double score;
    private String requestMessage;
    private String attachmentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Match() {
    }

    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }

    public Case getLegalCase() {
        return legalCase;
    }

    public void setLegalCase(Case legalCase) {
        this.legalCase = legalCase;
    }

    public User getMatchedUser() {
        return matchedUser;
    }

    public void setMatchedUser(User matchedUser) {
        this.matchedUser = matchedUser;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getProviderType() {
        return providerType;
    }

    public void setProviderType(String providerType) {
        this.providerType = providerType;
    }

    public String getMatchStatus() {
        return matchStatus;
    }

    public void setMatchStatus(String matchStatus) {
        this.matchStatus = matchStatus;
        this.status = matchStatus;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.matchStatus = status;
    }

    public boolean isLawyerApprovedChat() {
        return lawyerApprovedChat;
    }

    public void setLawyerApprovedChat(boolean lawyerApprovedChat) {
        this.lawyerApprovedChat = lawyerApprovedChat;
    }

    public boolean isNgoApprovedChat() {
        return ngoApprovedChat;
    }

    public void setNgoApprovedChat(boolean ngoApprovedChat) {
        this.ngoApprovedChat = ngoApprovedChat;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    // Alias methods for milestone naming.
    public double getMatchScore() {
        return score;
    }

    public void setMatchScore(double matchScore) {
        this.score = matchScore;
    }

    public String getRequestMessage() {
        return requestMessage;
    }

    public void setRequestMessage(String requestMessage) {
        this.requestMessage = requestMessage;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (matchStatus == null && status == null) {
            matchStatus = "PENDING";
            status = "PENDING";
        } else if (matchStatus == null) {
            matchStatus = status;
        } else if (status == null) {
            status = matchStatus;
        }
        if (providerId == null && matchedUser != null) {
            providerId = matchedUser.getId();
        }
        if ((providerType == null || providerType.isBlank()) && matchedUser != null && matchedUser.getRole() != null) {
            providerType = matchedUser.getRole().name();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (matchStatus == null && status != null) {
            matchStatus = status;
        }
        if (status == null && matchStatus != null) {
            status = matchStatus;
        }
        if (providerId == null && matchedUser != null) {
            providerId = matchedUser.getId();
        }
        if ((providerType == null || providerType.isBlank()) && matchedUser != null && matchedUser.getRole() != null) {
            providerType = matchedUser.getRole().name();
        }
    }
}

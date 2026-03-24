package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    private String matchStatus; // PENDING, REQUESTED, APPROVED, REJECTED
    private boolean lawyerApprovedChat;
    private boolean ngoApprovedChat;
    private double score;
    private String requestMessage;
    private String attachmentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Match() {}

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public Case getLegalCase() { return legalCase; }
    public void setLegalCase(Case legalCase) { this.legalCase = legalCase; }

    public User getMatchedUser() { return matchedUser; }
    public void setMatchedUser(User matchedUser) { this.matchedUser = matchedUser; }

    public String getMatchStatus() { return matchStatus; }
    public void setMatchStatus(String matchStatus) { this.matchStatus = matchStatus; }

    public boolean isLawyerApprovedChat() { return lawyerApprovedChat; }
    public void setLawyerApprovedChat(boolean lawyerApprovedChat) { this.lawyerApprovedChat = lawyerApprovedChat; }

    public boolean isNgoApprovedChat() { return ngoApprovedChat; }
    public void setNgoApprovedChat(boolean ngoApprovedChat) { this.ngoApprovedChat = ngoApprovedChat; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getRequestMessage() { return requestMessage; }
    public void setRequestMessage(String requestMessage) { this.requestMessage = requestMessage; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (matchStatus == null) matchStatus = "PENDING";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

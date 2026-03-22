package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    private String matchStatus; // PENDING, ACCEPTED, REJECTED

    private boolean lawyerApprovedChat;
    private boolean ngoApprovedChat;

    private double score;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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

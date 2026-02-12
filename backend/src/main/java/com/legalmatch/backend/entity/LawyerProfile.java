package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import com.legalmatch.backend.entity.User;

@Entity
@Table(name = "lawyer_profiles")

public class LawyerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String specialization;

    private Integer experienceYears;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}

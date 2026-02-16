package com.legalmatch.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lawyer_profiles")
public class LawyerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialization;

    private String licenseNumber;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // getters and setters
}

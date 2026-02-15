package com.legalmatch.backend.entity;

import jakarta.persistence.*;

@Entity
public class NgoProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String organizationName;

    private String registrationNumber;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // getters and setters
}

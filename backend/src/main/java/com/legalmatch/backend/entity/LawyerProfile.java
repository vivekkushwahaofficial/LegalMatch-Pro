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
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public void setLicenseNumber(String licenseNumber) {
    }

    public void setSpecialization(String specialization) {
    }

    // getters and setters
}

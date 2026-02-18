package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
@Table(name = "lawyer_profiles")
public class LawyerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String specialization;

    // ✅ Proper setters
    @Setter
    private String licenseNumber;

    @Setter
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    // ✅ Optional getters (recommended)
    public Long getId() {
        return id;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public User getUser() {
        return user;
    }

}

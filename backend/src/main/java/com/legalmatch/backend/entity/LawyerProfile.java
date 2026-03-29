package com.legalmatch.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lawyer_profiles")
public class LawyerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String specialization;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(nullable = false)
    private String location;

    private boolean verified;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
@Table(name = "ngo_profiles")
public class NgoProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String organizationName;

    @Setter
    private String registrationNumber;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // ✅ Proper setter for NGO name
    public void setNgoName(String ngoName) {
        this.organizationName = ngoName;
    }

    // ✅ Optional getters (good practice)
    public Long getId() {
        return id;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public User getUser() {
        return user;
    }
}

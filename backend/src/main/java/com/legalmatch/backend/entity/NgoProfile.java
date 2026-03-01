package com.legalmatch.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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

    @Setter
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
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

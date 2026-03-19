package com.legalmatch.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ngo_profiles")
public class NgoProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String organizationName;

    private String registrationNumber;

    private String location;

    private boolean verified;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setNgoName(String ngoName) {
    }

    public String getSpecialization() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
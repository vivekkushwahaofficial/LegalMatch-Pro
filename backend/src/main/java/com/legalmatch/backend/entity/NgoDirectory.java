package com.legalmatch.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "ngo_directory",
        indexes = {
            @Index(name = "idx_ngo_location", columnList = "location"),
            @Index(name = "idx_ngo_expertise", columnList = "expertise")
        })
public class NgoDirectory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    private String expertise;

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Boolean verified;

    @Column(length = 1000)
    private String organizationDetails;

    public NgoDirectory() {
    }

    @PrePersist
    @PreUpdate
    private void normalizeAndValidate() {
        name = name == null ? null : name.trim();
        location = location == null ? null : location.trim();
        expertise = expertise == null ? null : expertise.trim();
        organizationDetails = organizationDetails == null ? null : organizationDetails.trim();

        if (verified == null) {
            verified = false;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExpertise() {
        return expertise;
    }

    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getOrganizationDetails() {
        return organizationDetails;
    }

    public void setOrganizationDetails(String organizationDetails) {
        this.organizationDetails = organizationDetails;
    }
}

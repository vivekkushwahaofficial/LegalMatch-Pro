package com.legalmatch.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lawyer_directory",
       indexes = {
           @Index(name = "idx_lawyer_location", columnList = "location"),
           @Index(name = "idx_lawyer_expertise", columnList = "expertise")
       })
public class LawyerDirectory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String expertise;
    private String location;
    private Boolean verified;

    @Column(length = 1000)
    private String organizationDetails;

    public LawyerDirectory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public String getOrganizationDetails() { return organizationDetails; }
    public void setOrganizationDetails(String organizationDetails) { this.organizationDetails = organizationDetails; }
}

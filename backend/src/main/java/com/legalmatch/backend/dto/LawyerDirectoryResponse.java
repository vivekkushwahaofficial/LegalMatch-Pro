package com.legalmatch.backend.dto;

public class LawyerDirectoryResponse {

    private Long id;
    private String type;
    private String source;
    private String name;
    private String expertise;
    private String specialization;
    private String location;
    private boolean verified;
    private String organizationDetails;

    public LawyerDirectoryResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
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

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getOrganizationDetails() {
        return organizationDetails;
    }

    public void setOrganizationDetails(String organizationDetails) {
        this.organizationDetails = organizationDetails;
    }
}

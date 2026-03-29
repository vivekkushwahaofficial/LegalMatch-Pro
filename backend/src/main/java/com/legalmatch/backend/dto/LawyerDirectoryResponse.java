package com.legalmatch.backend.dto;

public class LawyerDirectoryResponse {
    private String name;
    private String specialization;
    private String location;
    private boolean verified;
    private String organizationDetails;

    public LawyerDirectoryResponse() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getOrganizationDetails() { return organizationDetails; }
    public void setOrganizationDetails(String organizationDetails) { this.organizationDetails = organizationDetails; }
}
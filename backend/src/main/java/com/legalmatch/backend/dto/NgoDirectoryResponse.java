package com.legalmatch.backend.dto;

public class NgoDirectoryResponse {
    private String ngoName;
    private String location;
    private boolean verified;
    private String organizationDetails;

    public NgoDirectoryResponse() {}

    public String getNgoName() { return ngoName; }
    public void setNgoName(String ngoName) { this.ngoName = ngoName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getOrganizationDetails() { return organizationDetails; }
    public void setOrganizationDetails(String organizationDetails) { this.organizationDetails = organizationDetails; }
}
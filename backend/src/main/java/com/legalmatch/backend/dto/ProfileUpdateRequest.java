package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {

    private String name;
    private String location;

    // For Lawyer/NGO
    private String specialization;

    // For Lawyer
    private String licenseNumber;

    // For NGO
    private String ngoName;
    private String registrationNumber;
}

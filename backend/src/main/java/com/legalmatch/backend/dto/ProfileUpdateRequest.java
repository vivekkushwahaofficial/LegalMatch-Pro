package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {

    private String name;

    // For Lawyer
    private String specialization;
    private String licenseNumber;

    // For NGO
    private String ngoName;
    private String registrationNumber;
}

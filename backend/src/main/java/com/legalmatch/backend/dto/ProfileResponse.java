package com.legalmatch.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    
    // Lawyer/NGO common fields
    private String specialization;
    private String location;
    private boolean verified;

    // Lawyer specific
    private String licenseNumber;

    // NGO specific
    private String ngoName;
    private String registrationNumber;

}

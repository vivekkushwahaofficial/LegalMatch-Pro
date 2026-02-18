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

    // getters and setters

}

package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class NgoDirectoryResponse {

    private String ngoName;
    private String location;
    private boolean verified;

}
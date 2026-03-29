package com.legalmatch.backend.dto;

public class ExternalNgoDto {
    private String org_name;
    private String city;
    private String focus_area;
    private String registration_status;

    public ExternalNgoDto() {}

    public String getOrg_name() { return org_name; }
    public void setOrg_name(String org_name) { this.org_name = org_name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getFocus_area() { return focus_area; }
    public void setFocus_area(String focus_area) { this.focus_area = focus_area; }

    public String getRegistration_status() { return registration_status; }
    public void setRegistration_status(String registration_status) { this.registration_status = registration_status; }
}

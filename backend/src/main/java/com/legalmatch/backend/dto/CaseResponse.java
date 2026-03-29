package com.legalmatch.backend.dto;

import java.time.LocalDateTime;

public class CaseResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String userEmail;
    private String location;
    private String keywords;
    private String dateTime;
    private String contactInfo;
    private String otherPartyName;
    private String otherPartyLocation;
    private String otherPartyContact;
    private String otherPartyRepresentative;
    private String investigatingOfficer;
    private String witnesses;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }

    public String getDateTime() { return dateTime; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getOtherPartyName() { return otherPartyName; }
    public void setOtherPartyName(String otherPartyName) { this.otherPartyName = otherPartyName; }

    public String getOtherPartyLocation() { return otherPartyLocation; }
    public void setOtherPartyLocation(String otherPartyLocation) { this.otherPartyLocation = otherPartyLocation; }

    public String getOtherPartyContact() { return otherPartyContact; }
    public void setOtherPartyContact(String otherPartyContact) { this.otherPartyContact = otherPartyContact; }

    public String getOtherPartyRepresentative() { return otherPartyRepresentative; }
    public void setOtherPartyRepresentative(String otherPartyRepresentative) { this.otherPartyRepresentative = otherPartyRepresentative; }

    public String getInvestigatingOfficer() { return investigatingOfficer; }
    public void setInvestigatingOfficer(String investigatingOfficer) { this.investigatingOfficer = investigatingOfficer; }

    public String getWitnesses() { return witnesses; }
    public void setWitnesses(String witnesses) { this.witnesses = witnesses; }
}

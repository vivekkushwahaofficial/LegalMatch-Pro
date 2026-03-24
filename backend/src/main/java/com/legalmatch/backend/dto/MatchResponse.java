package com.legalmatch.backend.dto;

public class MatchResponse {
    private Long matchId;
    private Long caseId;
    private String caseTitle;
    private Long matchedUserId;
    private String matchedUserName;
    private String matchedUserRole;
    private String specialization;
    private String matchStatus;
    private boolean lawyerApprovedChat;
    private boolean ngoApprovedChat;
    private double score;
    private String requestMessage;
    private String attachmentUrl;

    public MatchResponse() {}

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getCaseTitle() { return caseTitle; }
    public void setCaseTitle(String caseTitle) { this.caseTitle = caseTitle; }

    public Long getMatchedUserId() { return matchedUserId; }
    public void setMatchedUserId(Long matchedUserId) { this.matchedUserId = matchedUserId; }

    public String getMatchedUserName() { return matchedUserName; }
    public void setMatchedUserName(String matchedUserName) { this.matchedUserName = matchedUserName; }

    public String getMatchedUserRole() { return matchedUserRole; }
    public void setMatchedUserRole(String matchedUserRole) { this.matchedUserRole = matchedUserRole; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getMatchStatus() { return matchStatus; }
    public void setMatchStatus(String matchStatus) { this.matchStatus = matchStatus; }

    public boolean isLawyerApprovedChat() { return lawyerApprovedChat; }
    public void setLawyerApprovedChat(boolean lawyerApprovedChat) { this.lawyerApprovedChat = lawyerApprovedChat; }

    public boolean isNgoApprovedChat() { return ngoApprovedChat; }
    public void setNgoApprovedChat(boolean ngoApprovedChat) { this.ngoApprovedChat = ngoApprovedChat; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getRequestMessage() { return requestMessage; }
    public void setRequestMessage(String requestMessage) { this.requestMessage = requestMessage; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
}

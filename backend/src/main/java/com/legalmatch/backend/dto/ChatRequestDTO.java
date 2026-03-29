package com.legalmatch.backend.dto;

public class ChatRequestDTO {
    private String message;
    private String attachmentUrl;

    public ChatRequestDTO() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
}

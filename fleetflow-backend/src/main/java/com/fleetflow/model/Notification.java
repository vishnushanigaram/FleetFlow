package com.fleetflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    private String id;
    private String type;
    private String title;
    private String message;
    private String severity;
    private Boolean isRead;
    private String createdAt;
    private String link;

    public Notification() {}

    public Notification(String id, String type, String title, String message, String severity, Boolean isRead, String createdAt, String link) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.link = link;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
}


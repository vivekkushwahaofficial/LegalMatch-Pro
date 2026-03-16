package com.legalmatch.backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.entity.Notification;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private List<Notification> notifications = new ArrayList<>();

    @GetMapping
    public List<Notification> getNotifications() {
        return notifications;
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {

        Notification n = notifications.stream()
                .filter(not -> not.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (n != null) {
            n.setReadStatus(true);
        }

        return n;
    }
}
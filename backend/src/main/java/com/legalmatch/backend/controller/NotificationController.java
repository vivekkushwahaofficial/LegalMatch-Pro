package com.legalaid.controller;

import com.legalaid.model.Notification;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/notifications")
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

        if(n != null) {
            n.setReadStatus(true);
        }

        return n;
    }
}
package com.legalmatch.backend.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.legalmatch.backend.entity.Notification;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ProfileService profileService;

    public NotificationService(NotificationRepository notificationRepository, ProfileService profileService) {
        this.notificationRepository = notificationRepository;
        this.profileService = profileService;
    }

    public List<Notification> getMyNotifications() {
        User currentUser = profileService.getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    @Transactional
    public Notification markMyNotificationAsRead(Long notificationId) {
        User currentUser = profileService.getCurrentUser();
        Notification notification = notificationRepository.findById(Objects.requireNonNull(notificationId, "notification id is required"))
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Prevent users from reading/updating another user's notification.
        if (!notification.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized notification access");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification createNotification(Long userId, String message, String type) {
        Notification notification = new Notification(userId, message, type);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }
}

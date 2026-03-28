package com.legalmatch.backend.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.legalmatch.backend.entity.ChatMessage;
import com.legalmatch.backend.entity.Match;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.ChatMessageRepository;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final MatchingService matchingService;
    private final ProfileService profileService;
    private final NotificationService notificationService;

    public ChatService(ChatMessageRepository chatMessageRepository,
            SimpMessagingTemplate messagingTemplate,
            MatchingService matchingService,
            ProfileService profileService,
            NotificationService notificationService) {
        this.chatMessageRepository = chatMessageRepository;
        this.messagingTemplate = messagingTemplate;
        this.matchingService = matchingService;
        this.profileService = profileService;
        this.notificationService = notificationService;
    }

    public ChatMessage saveMessage(ChatMessage message) {
        if (message.getMatchId() == null) {
            throw new RuntimeException("matchId is required");
        }

        Match match = matchingService.getAuthorizedAcceptedMatch(message.getMatchId());
        User currentUser = profileService.getCurrentUser();

        // Always trust sender from JWT principal, not from client payload.
        message.setSenderId(currentUser.getId());

        ChatMessage saved = chatMessageRepository.save(message);

        // Broadcast via WebSocket
        messagingTemplate.convertAndSend("/topic/chats/" + message.getMatchId(), saved);

        Long caseOwnerId = match.getLegalCase().getUser().getId();
        Long providerId = match.getMatchedUser().getId();
        Long recipientId = currentUser.getId().equals(caseOwnerId) ? providerId : caseOwnerId;

        notificationService.createNotification(
                recipientId,
                "New message in case: " + match.getLegalCase().getTitle(),
                "NEW_MESSAGE"
        );

        return saved;
    }

    public List<ChatMessage> getChatHistory(Long matchId) {
        matchingService.getAuthorizedAcceptedMatch(matchId);
        return chatMessageRepository.findByMatchIdOrderByTimestampAsc(matchId);
    }
}

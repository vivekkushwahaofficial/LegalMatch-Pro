package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.ChatMessage;
import com.legalmatch.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatMessage saveMessage(ChatMessage message) {
        ChatMessage saved = chatMessageRepository.save(message);
        // Broadcast via WebSocket
        messagingTemplate.convertAndSend("/topic/chats/" + message.getMatchId(), saved);
        return saved;
    }

    public List<ChatMessage> getChatHistory(Long matchId) {
        return chatMessageRepository.findByMatchIdOrderByTimestampAsc(matchId);
    }
}

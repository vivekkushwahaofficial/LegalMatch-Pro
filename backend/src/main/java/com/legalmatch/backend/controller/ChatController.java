package com.legalmatch.backend.controller;

import com.legalmatch.backend.entity.ChatMessage;
import com.legalmatch.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    public void receiveMessage(@Payload ChatMessage chatMessage) {
        chatService.saveMessage(chatMessage);
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        return ResponseEntity.ok(chatService.saveMessage(message));
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable Long matchId) {
        return ResponseEntity.ok(chatService.getChatHistory(matchId));
    }
}

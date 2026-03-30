package com.legalmatch.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.entity.ChatMessage;
import com.legalmatch.backend.service.ChatService;

@RestController
@RequestMapping({"/api/chats", "/chats", "/api/chat"})
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendMessage")
    public void receiveMessage(@Payload ChatMessage chatMessage) {
        chatService.saveMessage(chatMessage);
    }

    @PostMapping({"/send", "/messages"})
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        return ResponseEntity.ok(chatService.saveMessage(message));
    }

    @GetMapping({"/{matchId}", "/history/{matchId}"})
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable Long matchId) {
        return ResponseEntity.ok(chatService.getChatHistory(matchId));
    }
}

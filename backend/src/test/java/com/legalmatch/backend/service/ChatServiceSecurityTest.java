package com.legalmatch.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.ChatMessage;
import com.legalmatch.backend.entity.Match;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.ChatMessageRepository;

@ExtendWith(MockitoExtension.class)
class ChatServiceSecurityTest {

    @Mock
    private ChatMessageRepository chatMessageRepository;
    @Mock
    private SimpMessagingTemplate messagingTemplate;
    @Mock
    private MatchingService matchingService;
    @Mock
    private ProfileService profileService;
    @Mock
    private NotificationService notificationService;

    private ChatService chatService;

    @BeforeEach
    void setUp() {
        chatService = new ChatService(
                chatMessageRepository,
                messagingTemplate,
                matchingService,
                profileService,
                notificationService
        );
    }

    @Test
    void saveMessage_setsSenderFromAuthenticatedUser_andNotifiesOtherParticipant() {
        User caseOwner = user(1L, Role.CITIZEN, "Citizen");
        User provider = user(2L, Role.LAWYER, "Lawyer");
        Match match = match(10L, caseOwner, provider);

        ChatMessage message = new ChatMessage();
        message.setMatchId(10L);
        message.setContent("hello");
        message.setSenderId(999L);

        when(matchingService.getAuthorizedAcceptedMatch(10L)).thenReturn(match);
        when(profileService.getCurrentUser()).thenReturn(provider);
        when(chatMessageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage saved = invocation.getArgument(0);
            saved.setId(123L);
            return saved;
        });

        ChatMessage saved = chatService.saveMessage(message);

        assertEquals(2L, saved.getSenderId());
        assertEquals(123L, saved.getId());

        verify(messagingTemplate).convertAndSend(eq("/topic/chats/10"), eq(saved));
        verify(notificationService).createNotification(eq(1L), any(String.class), eq("NEW_MESSAGE"));
    }

    @Test
    void saveMessage_rejectsMissingMatchId() {
        ChatMessage message = new ChatMessage();
        RuntimeException ex = assertThrows(RuntimeException.class, () -> chatService.saveMessage(message));
        assertEquals("matchId is required", ex.getMessage());
    }

    private static User user(Long id, Role role, String name) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        user.setName(name);
        return user;
    }

    private static Match match(Long matchId, User caseOwner, User provider) {
        Case legalCase = new Case();
        legalCase.setId(200L);
        legalCase.setTitle("Secure Chat Case");
        legalCase.setUser(caseOwner);

        Match match = new Match();
        match.setMatchId(matchId);
        match.setLegalCase(legalCase);
        match.setMatchedUser(provider);
        match.setMatchStatus("APPROVED");
        return match;
    }
}

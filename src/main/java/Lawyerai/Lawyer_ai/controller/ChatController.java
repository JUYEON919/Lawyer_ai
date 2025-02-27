package Lawyerai.Lawyer_ai.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Lawyerai.Lawyer_ai.dto.ChatRequest;
import Lawyerai.Lawyer_ai.dto.MessageRequest;
import Lawyerai.Lawyer_ai.model.Chat;
import Lawyerai.Lawyer_ai.model.Message;
import Lawyerai.Lawyer_ai.service.ChatService;
import Lawyerai.Lawyer_ai.service.MessageService;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private MessageService messageService;

    // 새로운 채팅 생성 API
    @PostMapping("/chat")
    public Map<String, Object> createChat(@RequestBody ChatRequest chatRequest) {
        return chatService.createChat(chatRequest);
    }

    // 사용자별 채팅 목록 조회 API
    @GetMapping("/chats/{userId}")
    public List<Chat> getChats(@PathVariable Long userId) {
        return chatService.getChats(userId);
    }

    // 채팅에 메시지 전송 API
    @PostMapping("/message")
    public Map<String, Object> sendMessage(@RequestBody MessageRequest messageRequest) {
        return messageService.sendMessage(messageRequest);
    }

    // 특정 채팅의 메시지 조회 API
    @GetMapping("/chat/{chatId}")
    public List<Message> getMessages(@PathVariable Long chatId) {
        return messageService.getMessages(chatId);
    }
}

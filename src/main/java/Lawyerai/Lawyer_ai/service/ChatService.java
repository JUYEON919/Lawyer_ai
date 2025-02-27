package Lawyerai.Lawyer_ai.service;

import Lawyerai.Lawyer_ai.dto.ChatRequest;
import Lawyerai.Lawyer_ai.model.Chat;
import Lawyerai.Lawyer_ai.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    // 새로운 채팅 생성
    public Map<String, Object> createChat(ChatRequest chatRequest) {
        Chat chat = new Chat();
        chat.setId(chatRequest.getUserId());
        chat.setTitle(chatRequest.getTitle());

        // 채팅 저장
        chatRepository.save(chat);

        // 응답 결과
        Map<String, Object> response = new HashMap<>();
        response.put("message", "새 채팅이 생성되었습니다.");
        response.put("chatId", chat.getId());
        return response;
    }

    // 사용자별 채팅 목록 조회
    public List<Chat> getChats(Long userId) {
        return chatRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
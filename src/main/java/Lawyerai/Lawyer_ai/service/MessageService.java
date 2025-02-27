package Lawyerai.Lawyer_ai.service;

import Lawyerai.Lawyer_ai.dto.MessageRequest;
import Lawyerai.Lawyer_ai.model.Message;
import Lawyerai.Lawyer_ai.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    // 메시지 전송
    public Map<String, Object> sendMessage(MessageRequest messageRequest) {
        Message message = new Message();
        message.setChatId(messageRequest.getChatId());
        message.setSender(messageRequest.getSender());
        message.setText(messageRequest.getText());

        // 메시지 저장
        messageRepository.save(message);

        // 응답 결과
        Map<String, Object> response = new HashMap<>();
        response.put("message", "메시지가 성공적으로 전송되었습니다.");
        return response;
    }

    // 특정 채팅의 메시지 조회
    public List<Message> getMessages(Long chatId) {
        return messageRepository.findByChatIdOrderByCreatedAt(chatId);
    }
}

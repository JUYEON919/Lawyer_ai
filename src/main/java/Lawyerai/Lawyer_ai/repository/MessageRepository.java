package Lawyerai.Lawyer_ai.repository;

import Lawyerai.Lawyer_ai.model.Message;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatIdOrderByCreatedAt(Long chatId);
}
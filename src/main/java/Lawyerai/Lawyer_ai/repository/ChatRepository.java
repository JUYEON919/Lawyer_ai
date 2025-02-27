package Lawyerai.Lawyer_ai.repository;

import Lawyerai.Lawyer_ai.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByUserIdOrderByCreatedAtDesc(Long userId);
}

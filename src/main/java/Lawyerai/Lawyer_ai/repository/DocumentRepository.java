package Lawyerai.Lawyer_ai.repository;

import Lawyerai.Lawyer_ai.model.DocumentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentRequest, Long> {
    // 추가적으로 사용자 요청에 따라 PDF 생성 요청 기록을 저장하거나 검색할 수 있음
    // 예: List<DocumentRequest> findByStatus(String status);
}


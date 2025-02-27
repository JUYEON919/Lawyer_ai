package Lawyerai.Lawyer_ai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_requests")
public class DocumentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // 문서 제목

    @Column(nullable = false)
    private String type; // 문서 유형 (예: 계약서, 합의서 등)

    @Column(nullable = false)
    private LocalDateTime createdAt; // 요청 생성 시간

    @Column(nullable = false)
    private String status; // 요청 상태 (예: PENDING, COMPLETED, FAILED)

    @Column(nullable = true)
    private String resultLink; // 생성된 PDF 링크 (AI 모델 반환 값)

    // 기본 생성자
    public DocumentRequest() {}

    // 생성자
    public DocumentRequest(String title, String type, LocalDateTime createdAt, String status, String resultLink) {
        this.title = title;
        this.type = type;
        this.createdAt = createdAt;
        this.status = status;
        this.resultLink = resultLink;
    }

    // Getter 및 Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResultLink() {
        return resultLink;
    }

    public void setResultLink(String resultLink) {
        this.resultLink = resultLink;
    }
}

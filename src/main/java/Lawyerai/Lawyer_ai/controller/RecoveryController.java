package Lawyerai.Lawyer_ai.controller;

import Lawyerai.Lawyer_ai.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/recovery")
public class RecoveryController {
    private final EmailService emailService;
    private String recoveryCode = null;//단일 코드 저장 변수 추가

    public RecoveryController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendRecoveryEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "이메일을 입력하세요"));
        }

        recoveryCode = emailService.sendRecoveryEmail(email); //새로운 코드 저장
        return ResponseEntity.ok(Map.of("message", "복구 코드가 이메일로 전송되었습니다."));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestBody Map<String, String> request) {
        String code = request.get("code");

        if (code == null || recoveryCode == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "잘못된 요청입니다."));
        }

        if (!recoveryCode.equals(code)) {
            return ResponseEntity.badRequest().body(Map.of("message", "코드가 올바르지 읺습니다."));

        }

        recoveryCode = null;
        return ResponseEntity.ok(Map.of("message", "인증 성공! 비밀번호를 변경하세요."));
    }
}

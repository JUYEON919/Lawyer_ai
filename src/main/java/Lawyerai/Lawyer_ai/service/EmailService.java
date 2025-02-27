package Lawyerai.Lawyer_ai.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String sendRecoveryEmail(String toEmail) {
        if (mailSender == null) {// JavaMailSender 디버깅용
            throw new IllegalStateException("JavaMailSender가 null 입니다. 설정을 확인하세요.");
        }

        try {
            String code = generateCode();
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8"); // ✅ 여기도 수정

            helper.setTo(toEmail);
            helper.setSubject("비밀번호 복구 코드");
            helper.setText("귀하의 복구 코드는 다음과 같습니다: " + code, false);

            mailSender.send(mimeMessage); //이메일 전솔

            return code; //정상적으로 코드 반환

        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 실패: " + e.getMessage());
        }
    }

    private String generateCode() {
        return String.valueOf((int) (Math.random() * 900000) + 100000); // 6자리 코드 생성
    }
}

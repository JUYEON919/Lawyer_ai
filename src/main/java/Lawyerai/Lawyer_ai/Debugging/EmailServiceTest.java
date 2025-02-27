package Lawyerai.Lawyer_ai.Debugging;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

public class EmailServiceTest {
    //메일 서비스 구동 활성화 명령어:
    //$env:MAIL_USERNAME="email_username"
    //$env:MAIL_PASSWORD="email_password"
    //환경 변수 참조를 위해 필요한 명령어 입니다. 입력 하지 않을시, 참조 오류가 생깁니다.
    //필요한 정보는 .env 파일을 확인 하세요.
}

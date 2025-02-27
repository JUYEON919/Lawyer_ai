package Lawyerai.Lawyer_ai.Debugging;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MailPropertyCheck implements CommandLineRunner {

    @Value("${spring.mail.username:NOT_FOUND}")
    private String mailUsername;

    @Value("${spring.mail.password:NOT_FOUND}")
    private String mailPassword;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔍 spring.mail.username: " + mailUsername);
        System.out.println("🔍 spring.mail.password: " + (mailPassword.equals("NOT_FOUND") ? "NULL" : "******"));
    }
}


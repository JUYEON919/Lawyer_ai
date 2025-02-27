package Lawyerai.Lawyer_ai.Debugging;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EnvCheckRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        String mailUsername = System.getenv("MAIL_USERNAME");
        String mailPassword = System.getenv("MAIL_PASSWORD");

        System.out.println("🔍 MAIL_USERNAME: " + (mailUsername != null ? mailUsername : "NULL"));
        System.out.println("🔍 MAIL_PASSWORD: " + (mailPassword != null ? "******" : "NULL"));
    }
}

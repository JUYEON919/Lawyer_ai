package Lawyerai.Lawyer_ai;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Application {
    @Bean
    public Dotenv dotenv() {
        return Dotenv.configure().load(); // ✅ .env 파일을 로드하여 사용 가능하도록 설정
    }
}

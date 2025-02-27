package Lawyerai.Lawyer_ai.Debugging;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class EnvCheck {
    public static void main(String[] args) {
        Properties properties = new Properties();

        try {
            File file = new File(System.getProperty("user.dir") + "/.env");
            if (file.exists()) {
                properties.load(new FileInputStream(file));
                System.out.println("✅ .env 파일이 로드되었습니다!");
            } else {
                System.out.println("❌ .env 파일이 존재하지 않습니다!");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 환경 변수 값 확인
        System.out.println("🔍 MAIL_USERNAME: " + properties.getProperty("MAIL_USERNAME"));
        System.out.println("🔍 MAIL_PASSWORD: " + properties.getProperty("MAIL_PASSWORD"));
    }
}

package Lawyerai.Lawyer_ai.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

@Service
public class LawBotService {
    private final String LLM_API_URL = "http://localhost:8000/predict";

    public String getAdvice(String question) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-type", "application/json");

        String requestBody = String.format("{\"question\":\"%s\"}", question);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    LLM_API_URL, HttpMethod.POST, entity, String.class);
            return response.getBody();
        } catch (Exception e) {
            return "법률적 AI 서비스를 호출하는 중 오류가 발생했습니다.";
        }
    }
}

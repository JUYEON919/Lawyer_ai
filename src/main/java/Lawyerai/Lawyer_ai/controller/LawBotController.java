package Lawyerai.Lawyer_ai.controller;

import Lawyerai.Lawyer_ai.service.LawBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class LawBotController {
    private final LawBotService lawBotService;

    @Autowired
    public LawBotController(LawBotService lawBotService) {
        this.lawBotService = lawBotService;
    }

    @GetMapping("/api/legal-advice")
    public String getLegalAdvice(@RequestParam(value="question",required = false) String question) {
        if (question != null && !question.trim().isEmpty()) {
            return lawBotService.getAdvice(question);
        }
        return "질문을 입력해주세요.";
    }
}
